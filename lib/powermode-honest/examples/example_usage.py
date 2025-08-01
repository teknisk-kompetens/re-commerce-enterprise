
"""
Power Mode 3.0 Honest Edition - Användningsexempel

Visar hur systemet används för verkliga workflow-organisationsuppgifter.
"""

import asyncio
import sys
import os

# Lägg till parent directory till path för import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import PowerModeHonest


async def example_development_workflow():
    """
    Exempel: Organisera en utvecklingsworkflow
    """
    print("\n🔧 Exempel: Utvecklingsworkflow")
    print("=" * 40)
    
    # Initiera systemet
    power_mode = PowerModeHonest()
    
    # Organisera workflow
    task_description = "Build a web application with user authentication and dashboard"
    result = await power_mode.organize_workflow(task_description)
    
    print(f"✅ Workflow skapad: {result['workflow_id']}")
    print(f"📋 Antal tasks: {result['estimated_tasks']}")
    print(f"🔍 Metod: {result['organization_method']}")
    
    # Hantera tasks
    workflow_id = result['workflow_id']
    task_result = await power_mode.manage_tasks(workflow_id)
    
    print(f"\n📊 Task management:")
    print(f"🎯 Prioriteringsmetod: {task_result['prioritization_method']}")
    
    # Simulera progress (ärligt)
    completed_tasks = ["planning_20250727_175800", "design_20250727_175801"]
    progress_result = await power_mode.track_progress(workflow_id, completed_tasks)
    
    print(f"\n📈 Progress tracking:")
    print(f"✅ Completed: {progress_result['completed_tasks']}")
    print(f"📊 Progress: {progress_result['progress_percent']}%")
    print(f"⏳ Remaining: {progress_result['remaining_tasks']} tasks")
    
    # Generera rapport
    report = await power_mode.generate_report(workflow_id)
    print(f"\n📋 Workflow rapport:")
    print(f"Status: {report['status']}")
    print(f"Progress: {report['progress_percent']}%")
    
    return workflow_id


async def example_research_workflow():
    """
    Exempel: Organisera en forskningsworkflow
    """
    print("\n🔬 Exempel: Forskningsworkflow")
    print("=" * 40)
    
    power_mode = PowerModeHonest()
    
    # Forskningsuppgift
    task_description = "Research and analyze market trends in sustainable technology"
    result = await power_mode.organize_workflow(task_description)
    
    print(f"✅ Forskningsworkflow skapad: {result['workflow_id']}")
    print(f"📚 Workflow typ: {result['structure']['workflow_type']}")
    print(f"🔍 Komplexitet: {result['structure']['estimated_complexity']}")
    
    # Visa phases
    phases = result['structure']['phases']
    print(f"\n📋 Forskningsfaser:")
    for i, phase in enumerate(phases, 1):
        print(f"{i}. {phase.replace('_', ' ').title()}")
    
    return result['workflow_id']


async def example_planning_workflow():
    """
    Exempel: Organisera en planeringsworkflow
    """
    print("\n📅 Exempel: Planeringsworkflow")
    print("=" * 40)
    
    power_mode = PowerModeHonest()
    
    # Planeringsuppgift
    task_description = "Plan and organize a team restructuring project"
    result = await power_mode.organize_workflow(task_description)
    
    print(f"✅ Planeringsworkflow skapad: {result['workflow_id']}")
    
    # Hantera och prioritera tasks
    workflow_id = result['workflow_id']
    task_result = await power_mode.manage_tasks(workflow_id)
    
    # Visa task plan
    task_plan = task_result['task_plan']
    print(f"\n📊 Task plan:")
    print(f"Total effort score: {task_plan['total_estimated_effort']['total_effort_score']}")
    print(f"Estimated complexity: {task_plan['total_estimated_effort']['estimated_complexity']}")
    
    # Visa kritisk väg
    critical_path = task_plan.get('critical_path', [])
    if critical_path:
        print(f"\n🎯 Kritisk väg ({len(critical_path)} tasks):")
        for task_id in critical_path[:3]:  # Visa första 3
            print(f"- {task_id}")
    
    return workflow_id


async def example_system_overview():
    """
    Exempel: Systemöversikt och metrics
    """
    print("\n📊 Exempel: Systemöversikt")
    print("=" * 40)
    
    power_mode = PowerModeHonest()
    
    # Skapa några workflows för demo
    workflows = []
    
    # Utveckling
    dev_result = await power_mode.organize_workflow("Create mobile app prototype")
    workflows.append(dev_result['workflow_id'])
    
    # Forskning  
    research_result = await power_mode.organize_workflow("Study user behavior patterns")
    workflows.append(research_result['workflow_id'])
    
    # Simulera lite progress
    await power_mode.track_progress(workflows[0], ["planning_task"])
    await power_mode.track_progress(workflows[1], ["literature_review", "methodology"])
    
    # Generera övergripande rapport
    system_report = await power_mode.generate_report()
    
    print(f"🖥️  Systemstatus: {system_report['system_status']}")
    print(f"⏱️  Session tid: {system_report['session_duration_minutes']} minuter")
    print(f"📋 Total workflows: {system_report['total_workflows']}")
    print(f"✅ Completed workflows: {system_report['completed_workflows']}")
    print(f"🔄 Active workflows: {system_report['active_workflows']}")
    
    # Visa metrics
    metrics = system_report.get('metrics', {})
    if metrics:
        print(f"\n📈 Ärliga metrics:")
        print(f"- Workflows denna session: {metrics.get('session_stats', {}).get('workflows_this_session', 0)}")
        print(f"- Genomsnittlig progress: {metrics.get('workflow_stats', {}).get('average_progress_percent', 0)}%")
        print(f"- Transparency note: {metrics.get('transparency_note', 'N/A')}")


async def main():
    """
    Kör alla exempel
    """
    print("🎯 Power Mode 3.0 Honest Edition - Användningsexempel")
    print("=" * 60)
    print("Visar verklig funktionalitet utan falska påståenden!")
    print("=" * 60)
    
    try:
        # Kör exempel
        await example_development_workflow()
        await example_research_workflow()
        await example_planning_workflow()
        await example_system_overview()
        
        print("\n" + "=" * 60)
        print("✅ Alla exempel genomförda!")
        print("💡 Detta visar systemets VERKLIGA kapacitet:")
        print("   - Strukturerad workflow organisation")
        print("   - Systematisk task management") 
        print("   - Transparent progress tracking")
        print("   - Ärlig metrics och reporting")
        print("\n❌ Systemet gör INTE:")
        print("   - Magisk AI-optimering")
        print("   - Fabricerade förbättringar")
        print("   - Simulerade resultat")
        print("   - Falska performance claims")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Fel i exempel: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
