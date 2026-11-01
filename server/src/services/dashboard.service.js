const {
  getContactMap,
  getFollowUpMap,
  getListMap,
  getInteractionMap,
} = require("../config/db");

function getDashboardStats(userId) {
  const allContacts = getContactMap()[userId] || [];
  const activeContacts = allContacts.filter((c) => !c.isDeleted);
  const deletedContacts = allContacts.filter((c) => c.isDeleted);
  const favoriteContacts = activeContacts.filter((c) => c.isFavorite);

  const contactNameMap = {};
  allContacts.forEach((c) => {
    contactNameMap[c.id] = `${c.firstName} ${c.lastName || ""}`.trim();
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const addedThisMonth = activeContacts.filter((c) => {
    if (!c.createdAt) return false;
    const d = new Date(c.createdAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  // Tag frequency
  const tagCounts = {};
  activeContacts.forEach((c) => {
    (c.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  // Follow-ups
  const allFollowUps = getFollowUpMap()[userId] || [];
  const activeContactIds = new Set(activeContacts.map((c) => c.id));
  const validFollowUps = allFollowUps.filter((f) => activeContactIds.has(f.contactId));

  let overdueCount = 0;
  let todayCount = 0;
  let upcomingCount = 0;
  let completedCount = 0;

  validFollowUps.forEach((f) => {
    if (f.status === "completed") {
      completedCount++;
      return;
    }
    const target = new Date(f.dueDate);
    if (isNaN(target.getTime())) return;
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) overdueCount++;
    else if (diff === 0) todayCount++;
    else upcomingCount++;
  });

  // Lists
  const userLists = getListMap()[userId] || [];

  // Interactions
  const allInteractions = getInteractionMap()[userId] || [];
  const interactionTypeCounts = {
    call: 0,
    email: 0,
    meeting: 0,
    note: 0,
  };
  allInteractions.forEach((i) => {
    if (interactionTypeCounts[i.type] !== undefined) {
      interactionTypeCounts[i.type]++;
    }
  });

  // Recent 5 contacts
  const recentContacts = [...activeContacts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      company: c.company,
      designation: c.designation,
      isFavorite: c.isFavorite,
      createdAt: c.createdAt,
    }));

  // Recent 6 activities with up-to-date contact names
  const recentActivities = [...allInteractions]
    .map((act) => ({
      ...act,
      contactName: contactNameMap[act.contactId] || act.contactName || "Contact",
    }))
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 6);

  return {
    metrics: {
      totalActiveContacts: activeContacts.length,
      totalDeletedContacts: deletedContacts.length,
      favoriteContacts: favoriteContacts.length,
      addedThisMonth,
      totalLists: userLists.length,
      totalInteractions: allInteractions.length,
      followUps: {
        total: validFollowUps.length,
        overdue: overdueCount,
        today: todayCount,
        upcoming: upcomingCount,
        completed: completedCount,
        pendingTotal: overdueCount + todayCount + upcomingCount,
      },
    },
    topTags,
    interactionBreakdown: interactionTypeCounts,
    recentContacts,
    recentActivities,
  };
}

module.exports = {
  getDashboardStats,
  getStats: getDashboardStats,
};
