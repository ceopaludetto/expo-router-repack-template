import { ExpoRoot } from "expo-router";
import { ctx } from "expo-router/_ctx";

export function Application() {
  return <ExpoRoot context={ctx} />;
}
