export const runtime = "nodejs";

export async function register() {
  const { initializeMongo, getMongoState } = await import("@/lib/config/mongo");
  await initializeMongo({ attempts: 5 });

  await import("@/models");

  const s = getMongoState();
  console.log(
    `[app] instrumentation(node) done. Mongo state: ${s.code} (${s.text})`,
  );
}
