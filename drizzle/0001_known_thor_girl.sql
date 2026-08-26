CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`evaluatorName` varchar(150) NOT NULL,
	`contentMastery` int NOT NULL,
	`prototyping` int NOT NULL,
	`communication` int NOT NULL,
	`socialImpact` int NOT NULL,
	`totalScore` int NOT NULL,
	`observations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stageId` int NOT NULL,
	`className` varchar(40) NOT NULL,
	`groupNumber` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `groups_stage_class_number_unique` UNIQUE(`stageId`,`className`,`groupNumber`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`name` varchar(150) NOT NULL,
	`isRepresentative` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','in_progress','ready','presented') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_group_unique` UNIQUE(`groupId`)
);
--> statement-breakpoint
CREATE TABLE `stages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`status` enum('draft','active','completed') NOT NULL DEFAULT 'draft',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stages_id` PRIMARY KEY(`id`),
	CONSTRAINT `stages_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `groups` ADD CONSTRAINT `groups_stageId_stages_id_fk` FOREIGN KEY (`stageId`) REFERENCES `stages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `members` ADD CONSTRAINT `members_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_groupId_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `evaluations_project_idx` ON `evaluations` (`projectId`);--> statement-breakpoint
CREATE INDEX `evaluations_created_idx` ON `evaluations` (`createdAt`);--> statement-breakpoint
CREATE INDEX `groups_stage_idx` ON `groups` (`stageId`);--> statement-breakpoint
CREATE INDEX `members_group_idx` ON `members` (`groupId`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);