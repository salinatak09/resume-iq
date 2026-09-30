export function getAnalysisTimeLabel(targetDate: Date | string | number): string {
  const parsedDate = new Date(targetDate);
  
  if (isNaN(parsedDate.getTime())) {
    return 'unknown date';
  }

  const now = Date.now();
  const timeDifferenceInMs = now - parsedDate.getTime();
  
  const oneHourInMs = 60 * 60 * 1000;
  const twentyFourHoursInMs = 24 * oneHourInMs;

  // Case 1: Less than 1 hour ago
  if (timeDifferenceInMs >= 0 && timeDifferenceInMs < oneHourInMs) {
    return 'recently';
  }

  // Case 2: Less than 24 hours ago (but more than 1 hour)
  if (timeDifferenceInMs >= 0 && timeDifferenceInMs < twentyFourHoursInMs) {
    const hoursAgo = Math.floor(timeDifferenceInMs / oneHourInMs);
    return `${hoursAgo} ${hoursAgo === 1 ? 'hr' : 'hrs'} ago`;
  }

  // Case 3: More than 24 hours ago (Show standard date)
  return `on ${parsedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

export const getScoreColor = (numScore: number) => {
  if (numScore >= 80) return 'emerald';
  if (numScore >= 70) return 'amber';
  return 'rose';
};
