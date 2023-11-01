import Client, { connect } from "../../deps.ts";

export enum Job {
  test = "test",
  build = "build",
}

export const exclude = ["target", ".git", ".devbox", ".fluentci"];

export const test = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from("rust:1.73-bookworm")
      .withExec(["apt-get", "update"])
      .withExec([
        "apt-get",
        "install",
        "-y",
        "build-essential",
        "libasound2-dev",
        "protobuf-compiler",
        "wget",
      ])
      .withExec([
        "wget",
        "https://github.com/taiki-e/cargo-llvm-cov/releases/download/v0.5.36/cargo-llvm-cov-x86_64-unknown-linux-gnu.tar.gz",
      ])
      .withExec([
        "tar",
        "xvf",
        "cargo-llvm-cov-x86_64-unknown-linux-gnu.tar.gz",
      ])
      .withExec(["mv", "cargo-llvm-cov", "/usr/local/bin"])
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withMountedCache("/app/target", client.cacheVolume("target"))
      .withMountedCache("/root/cargo/registry", client.cacheVolume("registry"))
      .withExec(["cp", "-r", "fixtures/audio", "/tmp"])
      .withExec(["cp", "fixtures/asound.conf", "/etc"])
      .withWorkdir("/app/migration")
      .withEnvVariable("DATABASE_URL", "sqlite:///tmp/music-player.sqlite3")
      .withExec(["cargo", "run"])
      .withWorkdir("/app")
      .withEnvVariable("MUSIC_PLAYER_APPLICATION_DIRECTORY", "/tmp")
      .withEnvVariable("MUSIC_PLAYER_MUSIC_DIRECTORY", "/tmp/audio")
      .withEnvVariable(
        "MUSIC_PLAYER_DATABASE_URL",
        "sqlite:///tmp/music-player.sqlite3"
      )
      .withEnvVariable("MUSIC_PLAYER_PORT", "5040")
      .withExec(["cargo", "run", "--", "scan"])
      .withExec([
        "sh",
        "-c",
        "cd server && cargo run & \
         sleep 3 \
         cargo llvm-cov --all-features --lib --workspace --lcov --output-path lcov.info",
      ]);

    await ctr.file("/app/lcov.info").export("./lcov.info");
    await ctr.stdout();
  });
  return "Done";
};

export const build = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = client
      .pipeline(Job.build)
      .container()
      .from("ghcr.io/fluentci-io/pkgx:latest")
      .withExec([
        "pkgx",
        "install",
        "rustc",
        "cargo",
        "node@18",
        "bun",
        "protoc",
      ])
      .withExec(["apt-get", "update"])
      .withExec([
        "apt-get",
        "install",
        "-y",
        "build-essential",
        "libasound2-dev",
      ])
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app/webui/musicplayer")
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "build"])
      .withWorkdir("/app")
      .withMountedCache("/app/target", client.cacheVolume("target"))
      .withMountedCache("/root/cargo/registry", client.cacheVolume("registry"))
      .withMountedCache("/assets", client.cacheVolume("gh-release-assets"))
      .withEnvVariable("TAG", Deno.env.get("TAG") || "latest")
      .withEnvVariable(
        "TARGET",
        Deno.env.get("TARGET") || "x86_64-unknown-linux-gnu"
      )
      .withExec(["bash", "-c", "cargo build --release --target $TARGET"])
      .withExec([
        "bash",
        "-c",
        "tar czvf /assets/music-player_${TAG}_${TARGET}.tar.gz target/$TARGET/release/music-player",
      ])
      .withExec([
        "bash",
        "-c",
        "shasum -a 256 /assets/music-player_${TAG}_${TARGET}.tar.gz > /assets/music-player_${TAG}_${TARGET}.tar.gz.sha256",
      ]);

    await ctr.stdout();
  });
  return "Done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};