/** Serves an individual SKILL.md referenced by the agent-skills index. */
import { AGENT_SKILLS, findSkill } from "@/lib/agent-skills";

export function generateStaticParams() {
  return AGENT_SKILLS.map((skill) => ({ skill: skill.name }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ skill: string }> },
) {
  const { skill: name } = await params;
  const skill = findSkill(name);

  if (!skill) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(skill.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
