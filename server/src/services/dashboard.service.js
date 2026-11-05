const Contact = require("../models/Contact");
const FollowUp = require("../models/FollowUp");
const ContactList = require("../models/ContactList");
const Interaction = require("../models/Interaction");

async function getDashboardStats(userId) {
  const uId = String(userId);

  const [allContacts, allFollowUps, userLists, allInteractions] = await Promise.all([
    Contact.find({ userId: uId }),
    FollowUp.find({ userId: uId }),
    ContactList.find({ userId: uId }),
    Interaction.find({ userId: uId }),
  ]);

  const activeContacts = allContacts.filter((c) => !c.isDeleted);
  const deletedContacts = allContacts.filter((c) => c.isDeleted);
  const favoriteContacts = activeContacts.filter((c) => c.isFavorite);

  const contactNameMap = {};
  allContacts.forEach((c) => {
    contactNameMap[String(c._id || c.id)] = `${c.firstName} ${c.lastName || ""}`.trim();
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
  const activeContactIds = new Set(activeContacts.map((c) => String(c._id || c.id)));
  const validFollowUps = allFollowUps.filter((f) => activeContactIds.has(String(f.contactId)));

  let overdueCount = 0;
  let todayCount = 0;
  let upcomingCount = 0;
  let completedCount = 0;

  const todayStr = now.toISOString().split("T")[0];

  validFollowUps.forEach((f) => {
    if (f.status === "completed") {
      completedCount += 1;
    } else {
      const due = f.dueDate ? String(f.dueDate).split("T")[0] : todayStr;
      if (due < todayStr) overdueCount += 1;
      else if (due === todayStr) todayCount += 1;
      else upcomingCount += 1;
    }
  });

  // Interaction types breakdown
  const interactionTypeCounts = {
    call: 0,
    email: 0,
    meeting: 0,
    note: 0,
  };
  allInteractions.forEach((i) => {
    if (interactionTypeCounts[i.type] !== undefined) {
      interactionTypeCounts[i.type] += 1;
    }
  });

  // Recent 6 active contacts
  const recentContacts = [...activeContacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((c) => ({
      id: String(c._id || c.id),
      firstName: c.firstName,
      lastName: c.lastName || "",
      company: c.company || "",
      email: c.email || "",
      phone: c.phone || "",
      isFavorite: c.isFavorite,
      tags: c.tags || [],
      createdAt: c.createdAt,
    }));

  // Recent 6 activity timeline records
  const recentActivities = [...allInteractions]
    .map((act) => {
      const a = act.toObject ? act.toObject() : act;
      const cId = String(a.contactId);
      return {
        id: String(a._id || a.id),
        contactId: cId,
        contactName: contactNameMap[cId] || a.contactName || "Contact",
        type: a.type,
        title: a.title || "",
        note: a.note || "",
        date: a.date ? new Date(a.date).toISOString() : new Date().toISOString(),
        createdAt: a.createdAt,
      };
    })
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
