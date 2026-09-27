/**
 * Shared grid template so the column header and every row line up. The two
 * delta columns only exist when there is a logged-in player to compare against.
 */
export function trackRowColumns(withComparison: boolean): string {
  return withComparison
    ? "64px minmax(0,1fr) 96px 104px 104px 68px 68px"
    : "64px minmax(0,1fr) 96px 104px 68px";
}
