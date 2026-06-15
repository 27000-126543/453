import type {
  GuildState,
  GuildMember,
  GuildBuilding,
  GuildJoinRequest,
  GuildRank,
  GuildPermissions,
} from '@/types';
import { generateId, clamp } from '@/utils';

export function getPermissionsByRank(rank: GuildRank): GuildPermissions {
  switch (rank) {
    case 'president':
      return {
        canApproveJoin: true,
        canKickMember: true,
        canEditInfo: true,
        canUpgradeBuilding: true,
        canManagePermissions: true,
      };
    case 'vice_president':
      return {
        canApproveJoin: true,
        canKickMember: true,
        canEditInfo: true,
        canUpgradeBuilding: true,
        canManagePermissions: false,
      };
    case 'tech_officer':
      return {
        canApproveJoin: true,
        canKickMember: false,
        canEditInfo: false,
        canUpgradeBuilding: true,
        canManagePermissions: false,
      };
    case 'member':
      return {
        canApproveJoin: false,
        canKickMember: false,
        canEditInfo: false,
        canUpgradeBuilding: false,
        canManagePermissions: false,
      };
    default:
      return {
        canApproveJoin: false,
        canKickMember: false,
        canEditInfo: false,
        canUpgradeBuilding: false,
        canManagePermissions: false,
      };
  }
}

function calculateRequiredExp(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function getBuildingTemplate(id: 'cloning_workshop' | 'sync_tower'): GuildBuilding {
  if (id === 'cloning_workshop') {
    return {
      id: 'cloning_workshop',
      name: '联合克隆工坊',
      level: 1,
      currentExp: 0,
      requiredExp: 100,
      bonus: {
        successRate: 0.02,
        syncEfficiency: 0,
      },
      description: '提升全体成员克隆合成成功率，每级+2%成功率',
    };
  }
  return {
    id: 'sync_tower',
    name: '意识同步塔',
    level: 1,
    currentExp: 0,
    requiredExp: 100,
    bonus: {
      successRate: 0,
      syncEfficiency: 0.03,
    },
    description: '提升双线操作效率，每级+3%同步效率加成',
  };
}

export function createGuild(
  president: { id: string; name: string },
  name: string
): GuildState {
  const now = Date.now();
  const presidentMember = createMember(president, 'president');

  const buildings: GuildBuilding[] = [
    getBuildingTemplate('cloning_workshop'),
    getBuildingTemplate('sync_tower'),
  ];

  return {
    id: generateId(),
    name,
    level: 1,
    announcement: '欢迎加入本公会，请积极贡献资源建设我们的克隆帝国！',
    members: [presidentMember],
    buildings,
    joinRequests: [],
    myRank: 'president',
    myPermissions: presidentMember.permissions,
  };
}

export function createMember(
  player: { id: string; name: string },
  rank: GuildRank
): GuildMember {
  const now = Date.now();
  return {
    id: player.id,
    name: player.name,
    rank,
    permissions: getPermissionsByRank(rank),
    contribution: {
      gold: 0,
      materials: 0,
      total: 0,
    },
    joinDate: now,
    lastActive: now,
  };
}

export function requestJoin(
  player: { id: string; name: string; level: number },
  message: string
): GuildJoinRequest {
  return {
    id: generateId(),
    playerId: player.id,
    playerName: player.name,
    playerLevel: player.level,
    message,
    timestamp: Date.now(),
  };
}

export function approveJoin(
  request: GuildJoinRequest,
  member: GuildMember,
  members: GuildMember[]
): { success: boolean; newMember: GuildMember | null; message: string } {
  if (!member.permissions.canApproveJoin) {
    return {
      success: false,
      newMember: null,
      message: '你没有审批入会的权限',
    };
  }

  const isAlreadyMember = members.some((m) => m.id === request.playerId);
  if (isAlreadyMember) {
    return {
      success: false,
      newMember: null,
      message: '该玩家已是公会成员',
    };
  }

  const newMember = createMember({ id: request.playerId, name: request.playerName }, 'member');
  return {
    success: true,
    newMember,
    message: `已批准 ${request.playerName} 加入公会`,
  };
}

export function rejectJoin(
  _requestId: string,
  member: GuildMember
): { success: boolean; message: string } {
  if (!member.permissions.canApproveJoin) {
    return {
      success: false,
      message: '你没有拒绝申请的权限',
    };
  }

  return {
    success: true,
    message: '已拒绝该申请',
  };
}

export function contributeResources(
  memberId: string,
  gold: number,
  materials: number,
  members: GuildMember[],
  buildings: GuildBuilding[]
): { members: GuildMember[]; buildings: GuildBuilding[]; message: string } {
  if (gold < 0 || materials < 0) {
    return {
      members,
      buildings,
      message: '贡献资源不能为负数',
    };
  }

  if (gold === 0 && materials === 0) {
    return {
      members,
      buildings,
      message: '请输入要贡献的资源数量',
    };
  }

  const updatedMembers = members.map((m) => {
    if (m.id === memberId) {
      return {
        ...m,
        contribution: {
          gold: m.contribution.gold + gold,
          materials: m.contribution.materials + materials,
          total: m.contribution.total + gold + materials,
        },
        lastActive: Date.now(),
      };
    }
    return m;
  });

  const goldPerBuilding = gold / 2;
  const materialsPerBuilding = materials / 2;

  const updatedBuildings = buildings.map((building) => {
    const newExp = building.currentExp + goldPerBuilding + materialsPerBuilding;
    return {
      ...building,
      currentExp: Math.min(newExp, building.requiredExp * 2),
    };
  });

  return {
    members: updatedMembers,
    buildings: updatedBuildings,
    message: `贡献成功！${gold} 金币和 ${materials} 材料已均分至两座建筑`,
  };
}

export function upgradeBuilding(
  building: GuildBuilding,
  operator: GuildMember
): { success: boolean; building: GuildBuilding; message: string } {
  if (!operator.permissions.canUpgradeBuilding) {
    return {
      success: false,
      building,
      message: '你没有升级建筑的权限',
    };
  }

  if (building.currentExp < building.requiredExp) {
    return {
      success: false,
      building,
      message: '建筑经验不足，无法升级',
    };
  }

  const newLevel = building.level + 1;
  const upgradedBuilding: GuildBuilding = {
    ...building,
    level: newLevel,
    currentExp: building.currentExp - building.requiredExp,
    requiredExp: calculateRequiredExp(newLevel),
    bonus: {
      successRate: building.bonus.successRate + (building.id === 'cloning_workshop' ? 0.02 : 0),
      syncEfficiency: building.bonus.syncEfficiency + (building.id === 'sync_tower' ? 0.03 : 0),
    },
  };

  return {
    success: true,
    building: upgradedBuilding,
    message: `${building.name} 成功升级至 ${newLevel} 级！`,
  };
}

export function setMemberRank(
  targetMemberId: string,
  newRank: GuildRank,
  operator: GuildMember,
  members: GuildMember[]
): { success: boolean; members: GuildMember[]; message: string } {
  if (!operator.permissions.canManagePermissions) {
    return {
      success: false,
      members,
      message: '你没有管理职位的权限',
    };
  }

  if (newRank === 'president') {
    const existingPresident = members.find((m) => m.rank === 'president');
    if (existingPresident && existingPresident.id !== targetMemberId) {
      return {
        success: false,
        members,
        message: '会长只能有一个，若要转让会长请先将现任会长降级',
      };
    }
  }

  const targetMember = members.find((m) => m.id === targetMemberId);
  if (!targetMember) {
    return {
      success: false,
      members,
      message: '未找到目标成员',
    };
  }

  const updatedMembers = members.map((m) => {
    if (m.id === targetMemberId) {
      return {
        ...m,
        rank: newRank,
        permissions: getPermissionsByRank(newRank),
      };
    }
    if (newRank === 'president' && m.rank === 'president' && m.id !== targetMemberId) {
      return {
        ...m,
        rank: 'member' as const,
        permissions: getPermissionsByRank('member'),
      };
    }
    return m;
  });

  return {
    success: true,
    members: updatedMembers,
    message: `已将 ${targetMember.name} 的职位更新为 ${getRankName(newRank)}`,
  };
}

export function kickMember(
  targetMemberId: string,
  operator: GuildMember,
  members: GuildMember[]
): { success: boolean; members: GuildMember[]; message: string } {
  if (!operator.permissions.canKickMember) {
    return {
      success: false,
      members,
      message: '你没有踢出成员的权限',
    };
  }

  const targetMember = members.find((m) => m.id === targetMemberId);
  if (targetMember && targetMember.rank === 'president') {
    return {
      success: false,
      members,
      message: '无法踢除会长',
    };
  }

  const updatedMembers = members.filter((m) => m.id !== targetMemberId);

  return {
    success: true,
    members: updatedMembers,
    message: `已将 ${targetMember?.name || '该成员'} 移出公会`,
  };
}

export function getGuildBonuses(guild: GuildState): {
  successRateBonus: number;
  syncBonus: number;
} {
  const successRateBonus = guild.buildings.reduce(
    (sum, building) => sum + building.bonus.successRate,
    0
  );
  const syncBonus = guild.buildings.reduce(
    (sum, building) => sum + building.bonus.syncEfficiency,
    0
  );

  return {
    successRateBonus,
    syncBonus,
  };
}

export function getRankName(rank: GuildRank): string {
  const rankMap: Record<GuildRank, string> = {
    president: '会长',
    vice_president: '副会长',
    tech_officer: '技术官',
    member: '成员',
  };
  return rankMap[rank] || rank;
}

export function getRankColor(rank: GuildRank): string {
  const colorMap: Record<GuildRank, string> = {
    president: 'text-yellow-400',
    vice_president: 'text-purple-400',
    tech_officer: 'text-blue-400',
    member: 'text-gray-400',
  };
  return colorMap[rank] || 'text-gray-400';
}
