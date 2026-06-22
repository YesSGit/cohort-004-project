import { eq, and, avg, count, sql } from "drizzle-orm";
import { db } from "~/db";
import { courseReviews, enrollments } from "~/db/schema";

export function getCourseRating(courseId: number) {
  const result = db
    .select({
      average: avg(courseReviews.rating),
      count: count(courseReviews.id),
    })
    .from(courseReviews)
    .where(eq(courseReviews.courseId, courseId))
    .get();

  return {
    average: result?.average ? Math.round(Number(result.average) * 10) / 10 : null,
    count: result?.count ?? 0,
  };
}

export function getCourseRatings(courseIds: number[]) {
  if (courseIds.length === 0) return new Map<number, { average: number | null; count: number }>();

  const results = db
    .select({
      courseId: courseReviews.courseId,
      average: avg(courseReviews.rating),
      count: count(courseReviews.id),
    })
    .from(courseReviews)
    .where(sql`${courseReviews.courseId} IN ${courseIds}`)
    .groupBy(courseReviews.courseId)
    .all();

  const map = new Map<number, { average: number | null; count: number }>();
  for (const row of results) {
    map.set(row.courseId, {
      average: row.average ? Math.round(Number(row.average) * 10) / 10 : null,
      count: row.count,
    });
  }
  return map;
}

export function getUserRatingForCourse(userId: number, courseId: number) {
  return db
    .select({ rating: courseReviews.rating })
    .from(courseReviews)
    .where(and(eq(courseReviews.userId, userId), eq(courseReviews.courseId, courseId)))
    .get()?.rating ?? null;
}

export function isUserEnrolledInCourse(userId: number, courseId: number) {
  return !!db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .get();
}

export function upsertCourseRating(userId: number, courseId: number, rating: number) {
  return db
    .insert(courseReviews)
    .values({ userId, courseId, rating, updatedAt: new Date().toISOString() })
    .onConflictDoUpdate({
      target: [courseReviews.userId, courseReviews.courseId],
      set: { rating, updatedAt: new Date().toISOString() },
    })
    .returning()
    .get();
}
