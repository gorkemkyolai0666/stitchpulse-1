#!/usr/bin/env python3
"""Transform escapepulse codebase to stitchpulse tailoring shop domain."""
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BACKEND_RENAMES = {
    "escape-venue": "tailoring-shop",
    "escape-rooms": "workstations",
    "game-sessions": "alteration-jobs",
    "puzzle-maintenance": "equipment-maintenance",
    "reset-checklists": "quality-checklists",
    "prop-orders": "fabric-orders",
    "rate-tiers": "service-rates",
}

FRONTEND_PAGE_RENAMES = {
    "escape-rooms": "workstations",
    "game-sessions": "alteration-jobs",
    "puzzle-maintenance": "equipment-maintenance",
    "reset-checklists": "quality-checklists",
    "prop-orders": "fabric-orders",
    "rate-tiers": "service-rates",
}

FILE_RENAMES = {
    "escape-venue.controller.ts": "tailoring-shop.controller.ts",
    "escape-venue.service.ts": "tailoring-shop.service.ts",
    "escape-venue.module.ts": "tailoring-shop.module.ts",
    "update-escape-venue.dto.ts": "update-tailoring-shop.dto.ts",
    "escape-rooms.controller.ts": "workstations.controller.ts",
    "escape-rooms.service.ts": "workstations.service.ts",
    "escape-rooms.module.ts": "workstations.module.ts",
    "escape-room.dto.ts": "workstation.dto.ts",
    "game-sessions.controller.ts": "alteration-jobs.controller.ts",
    "game-sessions.service.ts": "alteration-jobs.service.ts",
    "game-sessions.module.ts": "alteration-jobs.module.ts",
    "game-session.dto.ts": "alteration-job.dto.ts",
    "puzzle-maintenance.controller.ts": "equipment-maintenance.controller.ts",
    "puzzle-maintenance.service.ts": "equipment-maintenance.service.ts",
    "puzzle-maintenance.module.ts": "equipment-maintenance.module.ts",
    "puzzle-maintenance.dto.ts": "equipment-maintenance.dto.ts",
    "reset-checklists.controller.ts": "quality-checklists.controller.ts",
    "reset-checklists.service.ts": "quality-checklists.service.ts",
    "reset-checklists.module.ts": "quality-checklists.module.ts",
    "reset-checklist.dto.ts": "quality-checklist.dto.ts",
    "prop-orders.controller.ts": "fabric-orders.controller.ts",
    "prop-orders.service.ts": "fabric-orders.service.ts",
    "prop-orders.module.ts": "fabric-orders.module.ts",
    "prop-order.dto.ts": "fabric-order.dto.ts",
    "rate-tiers.controller.ts": "service-rates.controller.ts",
    "rate-tiers.service.ts": "service-rates.service.ts",
    "rate-tiers.module.ts": "service-rates.module.ts",
    "sidebar-nav.tsx": "top-nav.tsx",
}

REPLACEMENTS = [
    ("escapepulse-dev-secret", "stitchpulse-dev-secret"),
    ("escapepulse123", "stitchpulse123"),
    ("escapepulse", "stitchpulse"),
    ("EscapePulse", "StitchPulse"),
    ("escapeVenueName", "tailoringShopName"),
    ("escapeVenueId", "tailoringShopId"),
    ("escapeVenue", "tailoringShop"),
    ("EscapeVenue", "TailoringShop"),
    ("escape_venues", "tailoring_shops"),
    ("escape_venue", "tailoring_shop"),
    ("totalRooms", "totalWorkstations"),
    ("total_rooms", "total_workstations"),
    ("addOnRevenue", "rushFee"),
    ("add_on_revenue", "rush_fee"),
    ("dailyAddOnRevenue", "dailyRushFees"),
    ("puzzleMechanism", "machineModel"),
    ("puzzle_mechanism", "machine_model"),
    ("PuzzleMaintenance", "EquipmentMaintenance"),
    ("puzzleMaintenance", "equipmentMaintenance"),
    ("puzzle_maintenance", "equipment_maintenance"),
    ("puzzle-maintenance", "equipment-maintenance"),
    ("openPuzzleMaintenance", "openEquipmentMaintenance"),
    ("urgentPuzzleMaintenance", "urgentEquipmentMaintenance"),
    ("recentPuzzleMaintenance", "recentEquipmentMaintenance"),
    ("ResetChecklist", "QualityChecklist"),
    ("resetChecklist", "qualityChecklist"),
    ("reset_checklists", "quality_checklists"),
    ("reset-checklists", "quality-checklists"),
    ("pendingResetChecklists", "pendingQualityChecklists"),
    ("PropOrder", "FabricOrder"),
    ("propOrder", "fabricOrder"),
    ("prop_orders", "fabric_orders"),
    ("prop-orders", "fabric-orders"),
    ("pendingPropOrders", "pendingFabricOrders"),
    ("completedPropOrders", "completedFabricOrders"),
    ("propCategory", "fabricType"),
    ("prop_category", "fabric_type"),
    ("GameSession", "AlterationJob"),
    ("gameSession", "alterationJob"),
    ("game_sessions", "alteration_jobs"),
    ("game-sessions", "alteration-jobs"),
    ("gameType", "jobType"),
    ("game_type", "job_type"),
    ("totalGames", "totalJobs"),
    ("recentGames", "recentJobs"),
    ("sessionAt", "dueAt"),
    ("session_at", "due_at"),
    ("RoomTheme", "WorkstationSpecialty"),
    ("RoomStatus", "WorkstationStatus"),
    ("GameType", "JobType"),
    ("SessionStatus", "JobStatus"),
    ("PuzzlePriority", "EquipmentPriority"),
    ("PuzzleStatus", "EquipmentStatus"),
    ("ResetCategory", "ChecklistCategory"),
    ("ResetStatus", "ChecklistStatus"),
    ("PropOrderStatus", "FabricOrderStatus"),
    ("RateTier", "ServiceRate"),
    ("rateTier", "serviceRate"),
    ("rate_tiers", "service_rates"),
    ("rate-tiers", "service-rates"),
    ("RateCategory", "ServiceCategory"),
    ("RateStatus", "ServiceRateStatus"),
    ("EscapeRoomsService", "WorkstationsService"),
    ("EscapeRoomsController", "WorkstationsController"),
    ("EscapeRoomsModule", "WorkstationsModule"),
    ("CreateEscapeRoomDto", "CreateWorkstationDto"),
    ("UpdateEscapeRoomDto", "UpdateWorkstationDto"),
    ("EscapeVenueService", "TailoringShopService"),
    ("EscapeVenueController", "TailoringShopController"),
    ("EscapeVenueModule", "TailoringShopModule"),
    ("UpdateEscapeVenueDto", "UpdateTailoringShopDto"),
    ("GameSessionsService", "AlterationJobsService"),
    ("GameSessionsController", "AlterationJobsController"),
    ("GameSessionsModule", "AlterationJobsModule"),
    ("CreateGameSessionDto", "CreateAlterationJobDto"),
    ("UpdateGameSessionDto", "UpdateAlterationJobDto"),
    ("PuzzleMaintenanceService", "EquipmentMaintenanceService"),
    ("PuzzleMaintenanceController", "EquipmentMaintenanceController"),
    ("PuzzleMaintenanceModule", "EquipmentMaintenanceModule"),
    ("ResetChecklistsService", "QualityChecklistsService"),
    ("ResetChecklistsController", "QualityChecklistsController"),
    ("ResetChecklistsModule", "QualityChecklistsModule"),
    ("PropOrdersService", "FabricOrdersService"),
    ("PropOrdersController", "FabricOrdersController"),
    ("PropOrdersModule", "FabricOrdersModule"),
    ("roomUtilizationRate", "workstationUtilizationRate"),
    ("roomWings", "shopZones"),
    ("roomCount", "workstationCount"),
    ("availableRooms", "availableWorkstations"),
    ("inGameRooms", "inUseWorkstations"),
    ("escapeRoomId", "workstationId"),
    ("escape_room_id", "workstation_id"),
    ("EscapeRoom", "Workstation"),
    ("escapeRooms", "workstations"),
    ("escape_rooms", "workstations"),
    ("escape-rooms", "workstations"),
    ("escape-venue", "tailoring-shop"),
    ("@Controller('escape-rooms')", "@Controller('workstations')"),
    ("@Controller('game-sessions')", "@Controller('alteration-jobs')"),
    ("@Controller('puzzle-maintenance')", "@Controller('equipment-maintenance')"),
    ("@Controller('reset-checklists')", "@Controller('quality-checklists')"),
    ("@Controller('prop-orders')", "@Controller('fabric-orders')"),
    ("@Controller('rate-tiers')", "@Controller('service-rates')"),
    ("@Controller('escape-venue')", "@Controller('tailoring-shop')"),
    ("'/escape-rooms", "'/workstations"),
    ("'/game-sessions", "'/alteration-jobs"),
    ("'/puzzle-maintenance", "'/equipment-maintenance"),
    ("'/reset-checklists", "'/quality-checklists"),
    ("'/prop-orders", "'/fabric-orders"),
    ("'/rate-tiers", "'/service-rates"),
    ("'/escape-venue", "'/tailoring-shop"),
    ("api.escapeRooms", "api.workstations"),
    ("api.gameSessions", "api.alterationJobs"),
    ("api.puzzleMaintenance", "api.equipmentMaintenance"),
    ("api.resetChecklists", "api.qualityChecklists"),
    ("api.propOrders", "api.fabricOrders"),
    ("api.rateTiers", "api.serviceRates"),
    ("api.escapeVenue", "api.tailoringShop"),
    ("in_game", "in_use"),
    ("theme", "specialty"),
    ("4016", "4017"),
    ("3016", "3017"),
    ("5456", "5457"),
    ("SidebarNav", "TopNav"),
    ("sidebar-nav", "top-nav"),
    ("mystery-card", "atelier-card"),
    ("mystery-btn", "atelier-btn"),
    ("room-pill", "station-pill"),
    ("Mystery Manor Escapes", "Heritage Tailors & Alterations"),
    ("demo@mysterymanorescapes.com", "demo@heritagetailors.com"),
    ("mysterymanorescapes", "heritagetailors"),
    ("game_master", "tailor"),
    ("Cinzel", "Playfair Display"),
    ("IBM Plex Sans", "DM Sans"),
    ("font-cinzel", "font-playfair"),
    ("font-ibm-plex", "font-dm-sans"),
    ("--font-cinzel", "--font-playfair"),
    ("--font-ibm-plex", "--font-dm-sans"),
]

SKIP_DIRS = {".git", "node_modules", "dist", ".next", "coverage"}


def should_process(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return path.suffix in {
        ".ts", ".tsx", ".js", ".json", ".md", ".yml", ".yaml", ".sh",
        ".css", ".prisma", ".example", ".toml", ".txt", ".py",
    } or path.name in {".gitignore", "Dockerfile", "README.md"}


def replace_in_file(path: Path) -> None:
    if "transform-from-escapepulse.py" in str(path):
        return
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
    print("StitchPulse transform complete.")


if __name__ == "__main__":
    main()
