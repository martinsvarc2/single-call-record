const getColorByScore = (score: number): string => {
    if (score >= 90) return '#22C55E' // Zelená pro výborné skóre
    if (score >= 80) return '#10B981' // Zeleno-modrá pro velmi dobré skóre
    if (score >= 70) return '#3B82F6' // Modrá pro dobré skóre
    if (score >= 60) return '#6366F1' // Indigo pro průměrné skóre
    if (score >= 50) return '#8B5CF6' // Fialová pro podprůměrné skóre
    return '#EF4444' // Červená pro nízké skóre
  }
  
  export default getColorByScore
