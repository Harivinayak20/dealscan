/** Agent Skills discovery index (RFC v0.2.0). */
import { AGENT_SKILLS, APP_URL, sha256Hex } from "@/lib/agent-skills";

export async function GET() {
  const skills = await Promise.all(
    AGENT_SKILLS.map(async (skill) => ({
      name: skill.name,
      type: "skill-md",
      description: skill.description,
      url: `/.well-known/agent-skills/${skill.name}/SKILL.md`,
      digest: `sha256:${await sha256Hex(skill.body)}`,
    })),
  );

  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills,
  };

  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
      Link: `<${APP_URL}/.well-known/api-catalog>; rel="api-catalog"`,
    },
  });
}
