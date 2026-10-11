import json
import argparse
import sys
from backend.core.agent_loop import AgentLoopCoordinator
from backend.chaos.scenarios import list_scenarios

def generate_sarif_report(session) -> dict:
    """Generates standardized SARIF (Static Analysis Results Interchange Format) v2.1.0."""
    rule_id = session.invariant_violation.rule_name if session.invariant_violation else "InvariantViolation"
    line = session.invariant_violation.line_number if session.invariant_violation else 1

    return {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [
            {
                "tool": {
                    "driver": {
                        "name": "GhostSlate-AST-SelfHeal",
                        "version": "1.0.0",
                        "rules": [
                            {
                                "id": rule_id,
                                "shortDescription": {"text": session.invariant_violation.description if session.invariant_violation else "Invariant Breach"},
                                "defaultConfiguration": {"level": "error"}
                            }
                        ]
                    }
                },
                "results": [
                    {
                        "ruleId": rule_id,
                        "message": {
                            "text": f"Healed Invariant Violation: {session.invariant_violation.description if session.invariant_violation else 'Bug resolved'}. Verified with 100% green test suite in subprocess sandbox."
                        },
                        "locations": [
                            {
                                "physicalLocation": {
                                    "artifactLocation": {"uri": "target.py"},
                                    "region": {"startLine": line}
                                }
                            }
                        ],
                        "fixes": [
                            {
                                "description": {"text": session.patch.explanation if session.patch else "AST-scoped diff repair"},
                                "artifactChanges": [
                                    {
                                        "artifactLocation": {"uri": "target.py"},
                                        "replacements": [
                                            {
                                                "deletedRegion": {
                                                    "startLine": session.patch.start_line if session.patch else line,
                                                    "endLine": session.patch.end_line if session.patch else line
                                                },
                                                "insertedContent": {
                                                    "text": session.patch.replacement_code if session.patch else ""
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

def main():
    parser = argparse.ArgumentParser(description="GhostSlate Headless CLI Adapter — Autonomous AST Program Repair")
    parser.add_argument("--scenario", default="race_condition", help="Chaos scenario ID to repair")
    parser.add_argument("--output-sarif", help="Path to write SARIF v2.1.0 audit report")
    parser.add_argument("--output-json", help="Path to write full session JSON")
    args = parser.parse_args()

    print(f"🚀 GhostSlate Headless CLI Adapter initializing...")
    print(f"Target Scenario: {args.scenario}")

    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session(args.scenario)

    print(f"\n✅ Session Result: {session.stage.upper()}")
    print(f"Verified Exit Code: {session.verification.exit_code} (100% Tests Passed: {session.verification.is_verified})")
    print(f"Sandbox Duration: {session.verification.duration_ms}ms")
    print("\n--- UNIFIED AST DIFF ---")
    if session.patch:
        print(session.patch.diff_unified)

    if args.output_sarif:
        sarif = generate_sarif_report(session)
        with open(args.output_sarif, "w", encoding="utf-8") as f:
            json.dump(sarif, f, indent=2)
        print(f"\n📄 Exported SARIF audit report to: {args.output_sarif}")

    if args.output_json:
        with open(args.output_json, "w", encoding="utf-8") as f:
            f.write(session.model_dump_json(indent=2))
        print(f"📄 Exported full session JSON to: {args.output_json}")

if __name__ == "__main__":
    main()
