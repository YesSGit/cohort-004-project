PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_enrollments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`enrolled_at` text NOT NULL,
	`grade_score` real,
	`completed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_enrollments`("id", "user_id", "course_id", "enrolled_at", "grade_score", "completed_at") SELECT "id", "user_id", "course_id", "enrolled_at", "grade_score", "completed_at" FROM `enrollments`;--> statement-breakpoint
DROP TABLE `enrollments`;--> statement-breakpoint
ALTER TABLE `__new_enrollments` RENAME TO `enrollments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;