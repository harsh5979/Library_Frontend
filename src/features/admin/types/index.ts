export interface DashboardStats {
  totalBooks: number
  availableBooks: number
  totalMembers: number
  totalBorrows: number
  activeBorrowings: number
  overdueBooks: number
  activeReservations: number
  returnedThisMonth: number
  newMembersThisMonth: number
  totalFinesCollected: number
  pendingFines: number
}

export interface PopularBook {
  id: number
  title: string
  author: string
  borrowCount: number
}

export interface CategoryStat {
  category: string
  count: number
  percentage: number
}
