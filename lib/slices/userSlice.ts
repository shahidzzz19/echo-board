import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UserPreferences {
  categories: string[]
  language: string
  darkMode: boolean
  layout: "grid" | "list"
}

interface UserState {
  preferences: UserPreferences
  favorites: string[]
  isAuthenticated: boolean
  profile: {
    name: string
    email: string
    avatar: string
  } | null
}

const initialState: UserState = {
  preferences: {
    categories: ["technology", "sports"],
    language: "en",
    darkMode: false,
    layout: "grid",
  },
  favorites: [],
  isAuthenticated: false,
  profile: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const index = state.favorites.indexOf(itemId)
      if (index > -1) {
        state.favorites.splice(index, 1)
      } else {
        state.favorites.push(itemId)
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setProfile: (state, action: PayloadAction<UserState["profile"]>) => {
      state.profile = action.payload
    },
  },
})

export const { updatePreferences, toggleFavorite, setAuthenticated, setProfile } = userSlice.actions
export default userSlice.reducer
