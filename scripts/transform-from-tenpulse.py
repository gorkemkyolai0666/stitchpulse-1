#!/usr/bin/env python3
"""Transform tenpulse codebase to stitchpulse domain."""
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Directory renames (backend)
BACKEND_RENAMES = {
    "tennis-club": "tailoring-shop",
    "courts": "workstations",
    "lesson-sessions": "alteration-jobs",
    "ball-machine-maintenance": "equipment-maintenance",
    "court-maintenance": "quality-checklists",
    "stringing-orders": "fabric-orders",
}

# Frontend page renames
FRONTEND_PAGE_RENAMES = {
    "courts": "workstations",
    "lesson-sessions": "alteration-jobs",
    "ball-machine-maintenance": "equipment-maintenance",
    "court-maintenance": "quality-checklists",
    "stringing-orders": "fabric-orders",
}

# File renames inside backend modules
FILE_RENAMES = {
    "tennis-club.controller.ts": "tailoring-shop.controller.ts",
    "tennis-club.service.ts": "tailoring-shop.service.ts",
    "tennis-club.module.ts": "tailoring-shop.module.ts",
    "update-tennis-club.dto.ts": "update-tailoring-shop.dto.ts",
    "courts.controller.ts": "workstations.controller.ts",
    "courts.service.ts": "workstations.service.ts",
    "courts.module.ts": "workstations.module.ts",
    "court.dto.ts": "escape-room.dto.ts",
    "lesson-sessions.controller.ts": "alteration-jobs.controller.ts",
    "lesson-sessions.service.ts": "alteration-jobs.service.ts",
    "lesson-sessions.module.ts": "alteration-jobs.module.ts",
    "lesson-session.dto.ts": "game-session.dto.ts",
    "ball-machine-maintenance.controller.ts": "equipment-maintenance.controller.ts",
    "ball-machine-maintenance.service.ts": "equipment-maintenance.service.ts",
    "ball-machine-maintenance.module.ts": "equipment-maintenance.module.ts",
    "ball-machine-maintenance.dto.ts": "equipment-maintenance.dto.ts",
    "court-maintenance.controller.ts": "quality-checklists.controller.ts",
    "court-maintenance.service.ts": "quality-checklists.service.ts",
    "court-maintenance.module.ts": "quality-checklists.module.ts",
    "court-maintenance.dto.ts": "reset-checklist.dto.ts",
    "stringing-orders.controller.ts": "fabric-orders.controller.ts",
    "stringing-orders.service.ts": "fabric-orders.service.ts",
    "stringing-orders.module.ts": "fabric-orders.module.ts",
    "stringing-order.dto.ts": "prop-order.dto.ts",
    "top-tab-nav.tsx": "top-nav.tsx",
}

# Text replacements (order matters — longer first)
REPLACEMENTS = [
    ("tenpulse-dev-secret", "stitchpulse-dev-secret"),
    ("tenpulse123", "stitchpulse123"),
    ("tenpulse", "stitchpulse"),
    ("TenPulse", "StitchPulse"),
    ("tennisClubName", "tailoringShopName"),
    ("tennisClubId", "tailoringShopId"),
    ("tennisClub", "tailoringShop"),
    ("TennisClub", "TailoringShop"),
    ("tennis_clubs", "tailoring_shops"),
    ("tennis_club", "tailoring_shop"),
    ("totalCourts", "totalWorkstations"),
    ("total_courts", "total_workstations"),
    ("ballMachineRentalRevenue", "rushFee"),
    ("ball_machine_rental_revenue", "rush_fee"),
    ("dailyBallMachineRentalRevenue", "dailyRushFees"),
    ("ballMachineSpec", "machineModel"),
    ("ball_machine_spec", "machine_model"),
    ("BallMachineMaintenance", "EquipmentMaintenance"),
    ("ballMachineMaintenance", "equipmentMaintenance"),
    ("ball_machine_maintenance", "equipment_maintenance"),
    ("ball-machine-maintenance", "equipment-maintenance"),
    ("openBallMachineMaintenance", "openEquipmentMaintenance"),
    ("urgentBallMachineMaintenance", "urgentEquipmentMaintenance"),
    ("recentBallMachineMaintenance", "recentEquipmentMaintenance"),
    ("CourtMaintenance", "QualityChecklist"),
    ("courtMaintenance", "qualityChecklist"),
    ("court_maintenance", "quality_checklists"),
    ("court-maintenance", "quality-checklists"),
    ("pendingCourtMaintenance", "pendingQualityChecklists"),
    ("StringingOrder", "FabricOrder"),
    ("stringingOrder", "fabricOrder"),
    ("stringing_orders", "fabric_orders"),
    ("stringing-orders", "fabric-orders"),
    ("pendingStringingOrders", "pendingFabricOrders"),
    ("completedStringingOrders", "completedFabricOrders"),
    ("stringType", "fabricType"),
    ("string_type", "fabric_type"),
    ("racketModel", "supplierName"),
    ("racket_model", "supplier_name"),
    ("racketBrand", "propName"),
    ("LessonSession", "AlterationJob"),
    ("lessonSession", "alterationJob"),
    ("lesson_sessions", "alteration_jobs"),
    ("lesson-sessions", "alteration-jobs"),
    ("lessonType", "jobType"),
    ("lesson_type", "job_type"),
    ("totalLessons", "totalJobs"),
    ("recentLessons", "recentJobs"),
    ("CourtSurface", "WorkstationSpecialty"),
    ("CourtStatus", "WorkstationStatus"),
    ("LessonType", "JobType"),
    ("BallMachinePriority", "EquipmentPriority"),
    ("BallMachineStatus", "EquipmentStatus"),
    ("CourtMaintenanceCategory", "ChecklistCategory"),
    ("CourtMaintenanceStatus", "ChecklistStatus"),
    ("StringingStatus", "FabricOrderStatus"),
    ("CourtsService", "WorkstationsService"),
    ("CourtsController", "WorkstationsController"),
    ("CourtsModule", "WorkstationsModule"),
    ("CreateCourtDto", "CreateWorkstationDto"),
    ("UpdateCourtDto", "UpdateWorkstationDto"),
    ("TennisClubService", "TailoringShopService"),
    ("TennisClubController", "TailoringShopController"),
    ("TennisClubModule", "TailoringShopModule"),
    ("UpdateTennisClubDto", "UpdateTailoringShopDto"),
    ("LessonSessionsService", "AlterationJobsService"),
    ("LessonSessionsController", "AlterationJobsController"),
    ("LessonSessionsModule", "AlterationJobsModule"),
    ("CreateLessonSessionDto", "CreateAlterationJobDto"),
    ("UpdateLessonSessionDto", "UpdateAlterationJobDto"),
    ("BallMachineMaintenanceService", "EquipmentMaintenanceService"),
    ("BallMachineMaintenanceController", "EquipmentMaintenanceController"),
    ("BallMachineMaintenanceModule", "EquipmentMaintenanceModule"),
    ("CourtMaintenanceService", "QualityChecklistsService"),
    ("CourtMaintenanceController", "QualityChecklistsController"),
    ("CourtMaintenanceModule", "QualityChecklistsModule"),
    ("StringingOrdersService", "FabricOrdersService"),
    ("StringingOrdersController", "FabricOrdersController"),
    ("StringingOrdersModule", "FabricOrdersModule"),
    ("courtUtilizationRate", "workstationUtilizationRate"),
    ("courtWings", "shopZones"),
    ("courtCount", "workstationCount"),
    ("totalCourts", "totalWorkstations"),
    ("availableCourts", "availableWorkstations"),
    ("inUseCourts", "inUseWorkstations"),
    ("courtId", "workstationId"),
    ("court_id", "workstation_id"),
    ("@Controller('courts')", "@Controller('workstations')"),
    ("@Controller('lesson-sessions')", "@Controller('alteration-jobs')"),
    ("@Controller('ball-machine-maintenance')", "@Controller('equipment-maintenance')"),
    ("@Controller('court-maintenance')", "@Controller('quality-checklists')"),
    ("@Controller('stringing-orders')", "@Controller('fabric-orders')"),
    ("@Controller('tennis-club')", "@Controller('tailoring-shop')"),
    ("'/courts", "'/workstations"),
    ("'/lesson-sessions", "'/alteration-jobs"),
    ("'/ball-machine-maintenance", "'/equipment-maintenance"),
    ("'/court-maintenance", "'/quality-checklists"),
    ("'/stringing-orders", "'/fabric-orders"),
    ("'/tennis-club", "'/tailoring-shop"),
    ("api.courts", "api.workstations"),
    ("api.lessonSessions", "api.alterationJobs"),
    ("api.ballMachineMaintenance", "api.equipmentMaintenance"),
    ("api.courtMaintenance", "api.qualityChecklists"),
    ("api.stringingOrders", "api.fabricOrders"),
    ("in_use", "in_use"),
    ("surfaceType", "specialty"),
    ("surface", "specialty"),
    ("4015", "4017"),
    ("3015", "3017"),
    ("5455", "5457"),
    ("TopTabNav", "TopNav"),
    ("top-tab-nav", "top-nav"),
    ("clay-nav-border", "mystery-nav-border"),
    ("Sun Courts Tennis Club", "Heritage Tailors & Alterations"),
    ("demo@suncourtstennis.com", "demo@heritagetailors.com"),
    ("suncourtstennis", "heritagetailors"),
]

SKIP_DIRS = {".git", "node_modules", "dist", ".next", "coverage"}


def should_process(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return path.suffix in {
        ".ts", ".tsx", ".js", ".json", ".md", ".yml", ".yaml", ".sh",
        ".css", ".prisma", ".example", ".toml", ".txt",
    } or path.name in {".gitignore", "Dockerfile", "README.md"}


def replace_in_file(path: Path) -> None:
    try:
        content = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, IsADirectoryError):
        return
    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    if content != original:
        path.write_text(content, encoding="utf-8")


def rename_backend_dirs() -> None:
    backend_src = ROOT / "backend" / "src"
    for old, new in BACKEND_RENAMES.items():
        old_path = backend_src / old
        new_path = backend_src / new
        if old_path.exists():
            if new_path.exists():
                shutil.rmtree(new_path)
            old_path.rename(new_path)


def rename_frontend_pages() -> None:
    app_dir = ROOT / "frontend" / "src" / "app"
    for old, new in FRONTEND_PAGE_RENAMES.items():
        old_path = app_dir / old
        new_path = app_dir / new
        if old_path.exists():
            if new_path.exists():
                shutil.rmtree(new_path)
            old_path.rename(new_path)


def rename_files() -> None:
    for dirpath, _, filenames in os.walk(ROOT):
        if any(s in dirpath for s in SKIP_DIRS):
            continue
        for filename in filenames:
            if filename in FILE_RENAMES:
                old = Path(dirpath) / filename
                new = Path(dirpath) / FILE_RENAMES[filename]
                if new.exists():
                    new.unlink()
                old.rename(new)


def process_all_files() -> None:
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for filename in filenames:
            path = Path(dirpath) / filename
            if should_process(path):
                replace_in_file(path)


def main() -> None:
    rename_backend_dirs()
    rename_frontend_pages()
    rename_files()
    process_all_files()
    print("Transform complete.")


if __name__ == "__main__":
    main()
