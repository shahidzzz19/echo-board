import userSlice, { updatePreferences, toggleFavorite } from "@/lib/slices/userSlice"

describe("userSlice", () => {
  const initialState = {
    preferences: {
      categories: ["technology", "sports"],
      language: "en",
      darkMode: false,
      layout: "grid" as const,
    },
    favorites: [],
    isAuthenticated: false,
    profile: null,
  }

  it("should update preferences", () => {
    const newPreferences = { categories: ["technology", "finance"] }
    const action = updatePreferences(newPreferences)
    const newState = userSlice(initialState, action)

    expect(newState.preferences.categories).toEqual(["technology", "finance"])
    expect(newState.preferences.language).toBe("en") // Should preserve other properties
  })

  it("should add item to favorites", () => {
    const action = toggleFavorite("item-1")
    const newState = userSlice(initialState, action)

    expect(newState.favorites).toContain("item-1")
  })

  it("should remove item from favorites if already present", () => {
    const stateWithFavorite = {
      ...initialState,
      favorites: ["item-1", "item-2"],
    }

    const action = toggleFavorite("item-1")
    const newState = userSlice(stateWithFavorite, action)

    expect(newState.favorites).not.toContain("item-1")
    expect(newState.favorites).toContain("item-2")
  })
})
