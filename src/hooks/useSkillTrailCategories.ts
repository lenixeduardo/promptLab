import { useState, useEffect } from "react"
import { getSkillTrailCategories, DbSkillTrailCategory, DbSkillTrailItem } from "@/lib/db"
import {
  TRAIL_CATEGORY_SKILLS,
  TrailCategorySkills,
  TrailSkill,
} from "@/data/trailCategorySkillsData"

function mapDbItem(item: DbSkillTrailItem): TrailSkill {
  return {
    id: item.trail_item_id,
    name: item.name,
    description: item.description,
    icon: item.icon,
    level: item.level,
    xp: item.xp,
    difficulty: item.difficulty as TrailSkill["difficulty"],
  }
}

function mapDbCategory(cat: DbSkillTrailCategory): TrailCategorySkills {
  const items = [...(cat.skill_trail_items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return {
    categoryId: cat.category_id,
    label: cat.label,
    icon: cat.icon,
    skills: items.map(mapDbItem),
  }
}

export function useSkillTrailCategories() {
  const [categories, setCategories] = useState<TrailCategorySkills[]>(TRAIL_CATEGORY_SKILLS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSkillTrailCategories().then(({ data, error }) => {
      if (data && data.length > 0) setCategories(data.map(mapDbCategory))
      if (error) setError(error)
      setLoading(false)
    })
  }, [])

  return { categories, loading, error }
}
