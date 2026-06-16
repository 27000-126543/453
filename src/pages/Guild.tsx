import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/utils';
import {
  getRankName,
  getRankColor,
  getGuildBonuses,
  getPermissionsByRank,
} from '@/engine/guildEngine';
import {
  Building2,
  Users,
  UserCheck,
  ShieldCheck,
  Coins,
  ArrowUp,
  Check,
  X,
  Crown,
  ChevronDown,
} from 'lucide-react';
import type { GuildRank, GuildBuilding, GuildMember } from '@/types';

type TabType = 'buildings' | 'members' | 'joinRequests' | 'permissions';

const buildingIcons: Record<string, string> = {
  cloning_workshop: '🏭',
  sync_tower: '🗼',
};

const rankOrder: GuildRank[] = ['president', 'vice_president', 'tech_officer', 'member'];

export default function Guild() {
  const { guild, gold, createGuild, approveJoin, rejectJoin, contributeToGuild, upgradeBuilding, setMemberRank, kickMember, leaveGuild } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('buildings');
  const [guildName, setGuildName] = useState('');
  const [contributeGold, setContributeGold] = useState<Record<string, number>>({});
  const [showRankDropdown, setShowRankDropdown] = useState<string | null>(null);

  const hasGuild = guild.id !== null;
  const myPermissions = guild.myPermissions;
  const myRank = guild.myRank;

  const handleCreateGuild = () => {
    if (!guildName.trim()) {
      alert('请输入公会名称');
      return;
    }
    createGuild(guildName.trim());
  };

  const handleContribute = (buildingId: string) => {
    const amount = contributeGold[buildingId] || 0;
    if (amount <= 0) {
      alert('请输入贡献的金币数量');
      return;
    }
    if (amount > gold) {
      alert('金币不足');
      return;
    }
    contributeToGuild(amount, 0);
    setContributeGold((prev) => ({ ...prev, [buildingId]: 0 }));
  };

  const handleUpgradeBuilding = (buildingId: string) => {
    upgradeBuilding(buildingId);
  };

  const canUpgradeBuilding = (building: GuildBuilding) => {
    if (!myPermissions?.canUpgradeBuilding) return false;
    return building.currentExp >= building.requiredExp;
  };

  const getUpgradeTooltip = (building: GuildBuilding) => {
    if (!myPermissions?.canUpgradeBuilding) return '你没有升级建筑的权限';
    if (building.currentExp < building.requiredExp) return '建筑经验不足，无法升级';
    return '点击升级建筑';
  };

  const handleSetMemberRank = (memberId: string, rank: GuildRank) => {
    setMemberRank(memberId, rank);
    setShowRankDropdown(null);
  };

  const handleKickMember = (memberId: string, memberName: string) => {
    if (confirm(`确定要将 ${memberName} 移出公会吗？`)) {
      kickMember(memberId);
    }
  };

  const handleLeaveGuild = () => {
    if (confirm('确定要退出公会吗？退出后贡献将无法恢复。')) {
      leaveGuild();
    }
  };

  const sortedMembers = [...guild.members].sort((a, b) => {
    const rankA = rankOrder.indexOf(a.rank);
    const rankB = rankOrder.indexOf(b.rank);
    if (rankA !== rankB) return rankA - rankB;
    return b.contribution.total - a.contribution.total;
  });

  const renderCreateGuild = () => (
    <div className="glass-card p-12 max-w-md mx-auto text-center">
      <Building2 className="w-20 h-20 mx-auto mb-6 text-magic-400" />
      <h1 className="font-display text-3xl text-arcane-gold mb-4">创建公会</h1>
      <p className="text-gray-400 mb-8">创建属于你的克隆帝国公会，与志同道合的研究员一起成长</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2 font-display text-left">
            公会名称
          </label>
          <input
            type="text"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
            placeholder="请输入公会名称"
            maxLength={20}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-magic-950/60 border border-magic-500/30',
              'text-gray-200 font-display',
              'focus:outline-none focus:border-magic-400 transition-colors',
              'placeholder:text-gray-500'
            )}
          />
        </div>
        
        <button
          onClick={handleCreateGuild}
          disabled={!guildName.trim()}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3.5 rounded-lg',
            'bg-gradient-to-r from-arcane-gold via-yellow-500 to-arcane-gold',
            'hover:from-yellow-400 hover:via-arcane-gold hover:to-yellow-400',
            'transition-all duration-300',
            'font-display text-base text-gray-900 font-bold',
            'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
            'hover:shadow-[0_0_35px_rgba(251,191,36,0.6)]',
            'active:scale-[0.98]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
          )}
        >
          <Crown className="w-5 h-5" />
          创建公会
        </button>
        
        <p className="text-xs text-gray-500">
          创建后自动成为会长，拥有公会最高权限
        </p>
      </div>
    </div>
  );

  const renderGuildHeader = () => (
    <div className="glass-card p-6 mb-6 border-2 border-magic-500/30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-arcane-gold/30 via-yellow-600/20 to-magic-600/30',
            'border-2 border-arcane-gold/50'
          )}>
            <Building2 className="w-8 h-8 text-arcane-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-arcane-gold text-shadow-gold flex items-center gap-2">
              {guild.name}
              <span className="text-sm text-magic-300 font-normal">Lv.{guild.level}</span>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-magic-400" />
                <span className="text-sm text-gray-400">{guild.members.length} 名成员</span>
              </div>
              {myRank && (
                <div className="flex items-center gap-1.5">
                  <Crown className={cn('w-4 h-4', getRankColor(myRank))} />
                  <span className={cn('text-sm font-display', getRankColor(myRank))}>
                    {getRankName(myRank)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg',
            'bg-gradient-to-r from-arcane-gold/10 to-arcane-gold/5',
            'border border-arcane-gold/30'
          )}>
            <Coins className="w-4 h-4 text-arcane-gold" />
            <span className="font-display text-arcane-gold tabular-nums">
              {gold.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {guild.announcement && (
        <div className="mt-4 pt-4 border-t border-magic-500/20">
          <p className="text-sm text-gray-300">
            <span className="text-magic-400 font-display">公告：</span>
            {guild.announcement}
          </p>
        </div>
      )}
    </div>
  );

  const renderTabs = () => (
    <div className="glass-card p-1.5 mb-6 inline-flex gap-1.5">
      {([
        { key: 'buildings', label: '公会建筑', icon: Building2 },
        { key: 'members', label: '成员列表', icon: Users },
        { key: 'joinRequests', label: '入会审批', icon: UserCheck },
        { key: 'permissions', label: '权限说明', icon: ShieldCheck },
      ] as const).map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 font-display',
            activeTab === key
              ? 'bg-gradient-to-r from-magic-600 to-magic-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-magic-950/50'
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
          {key === 'joinRequests' && guild.joinRequests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {guild.joinRequests.length}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const renderBuildingsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {guild.buildings.map((building) => {
        const canUpgrade = canUpgradeBuilding(building);
        const upgradeTooltip = getUpgradeTooltip(building);
        const currentContribute = contributeGold[building.id] || 0;
        const expPercent = Math.min(100, (building.currentExp / building.requiredExp) * 100);
        
        return (
          <div
            key={building.id}
            className="glass-card p-6 border-2 border-magic-500/20 hover:border-magic-500/40 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
                'bg-gradient-to-br from-magic-600/30 via-magic-400/20 to-magic-800/30',
                'border-2 border-magic-500/30'
              )}>
                {buildingIcons[building.id]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-magic-200">{building.name}</h3>
                  <span className="text-sm text-arcane-gold font-display">Lv.{building.level}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{building.description}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">升级进度</span>
                <span className="text-magic-300 font-display tabular-nums">
                  {Math.floor(building.currentExp)} / {building.requiredExp}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${expPercent}%` }} />
              </div>
            </div>
            
            <div className="mb-5 p-3 rounded-lg bg-magic-950/50 border border-magic-500/20">
              <div className="text-sm text-gray-400 mb-2">当前加成</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-display text-green-400">
                  +{building.id === 'cloning_workshop' 
                    ? `${(building.bonus.successRate * 100).toFixed(0)}%` 
                    : `${(building.bonus.syncEfficiency * 100).toFixed(0)}%`}
                </span>
                <span className="text-sm text-gray-400">
                  {building.id === 'cloning_workshop' ? '合成成功率' : '双线操作效率'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2 font-display">
                贡献金币
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-arcane-gold" />
                  <input
                    type="number"
                    min={0}
                    value={currentContribute}
                    onChange={(e) => setContributeGold((prev) => ({
                      ...prev,
                      [building.id]: Math.max(0, parseInt(e.target.value) || 0),
                    }))}
                    placeholder="输入金币数量"
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-lg bg-magic-950/60 border border-magic-500/30',
                      'text-gray-200 font-display tabular-nums',
                      'focus:outline-none focus:border-magic-400 transition-colors',
                      'placeholder:text-gray-500'
                    )}
                  />
                </div>
                <button
                  onClick={() => handleContribute(building.id)}
                  disabled={currentContribute <= 0 || currentContribute > gold}
                  className={cn(
                    'px-5 py-2.5 rounded-lg flex items-center gap-1.5',
                    'bg-gradient-to-r from-arcane-gold/80 to-yellow-600/80',
                    'hover:from-arcane-gold hover:to-yellow-500',
                    'transition-all duration-300',
                    'font-display text-sm text-gray-900 font-bold',
                    'active:scale-[0.98]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  贡献
                </button>
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={() => handleUpgradeBuilding(building.id)}
                disabled={!canUpgrade}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-lg',
                  'transition-all duration-300 font-display',
                  canUpgrade
                    ? 'bg-gradient-to-r from-magic-600 to-magic-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98]'
                    : 'bg-magic-950/50 text-gray-500 cursor-not-allowed border border-magic-500/20'
                )}
              >
                <ArrowUp className="w-4 h-4" />
                升级建筑
              </button>
              {!canUpgrade && (
                <div className={cn(
                  'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5',
                  'bg-gray-900 text-gray-300 text-xs rounded-lg whitespace-nowrap',
                  'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
                  'border border-gray-700 z-10'
                )}>
                  {upgradeTooltip}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-magic-500/20 bg-magic-950/30">
                <th className="text-left py-3 px-4 font-display text-magic-300 text-sm">成员</th>
                <th className="text-left py-3 px-4 font-display text-magic-300 text-sm">职位</th>
                <th className="text-left py-3 px-4 font-display text-magic-300 text-sm">贡献值</th>
                <th className="text-right py-3 px-4 font-display text-magic-300 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member, index) => {
                const isMe = member.id === useGameStore.getState().id;
                const canManageRank = myPermissions?.canManagePermissions && !isMe;
                const canKick = myPermissions?.canKickMember && !isMe && member.rank !== 'president';
                const showDropdown = showRankDropdown === member.id;
                
                return (
                  <tr
                    key={member.id}
                    className={cn(
                      'border-b border-magic-500/10 hover:bg-magic-950/20 transition-colors',
                      index === sortedMembers.length - 1 && 'border-b-0'
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          'bg-gradient-to-br from-magic-600/40 to-magic-800/40',
                          'border border-magic-500/30',
                          isMe && 'ring-2 ring-arcane-gold/50'
                        )}>
                          <span className="text-sm font-display text-magic-200">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-display text-gray-200 flex items-center gap-2">
                            {member.name}
                            {isMe && (
                              <span className="text-xs text-arcane-gold">(我)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            加入于 {new Date(member.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('font-display text-sm', getRankColor(member.rank))}>
                        {getRankName(member.rank)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-display text-magic-200 tabular-nums">
                        {member.contribution.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        金币 {member.contribution.gold.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canManageRank && (
                          <div className="relative">
                            <button
                              onClick={() => setShowRankDropdown(showDropdown ? null : member.id)}
                              className={cn(
                                'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm',
                                'bg-magic-950/50 text-magic-300 border border-magic-500/20',
                                'hover:bg-magic-900/50 transition-colors font-display'
                              )}
                            >
                              设置职位
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {showDropdown && (
                              <div className="absolute right-0 top-full mt-1 py-1 rounded-lg bg-gray-900 border border-gray-700 shadow-lg z-20 min-w-[120px]">
                                {rankOrder.map((rank) => (
                                  <button
                                    key={rank}
                                    onClick={() => handleSetMemberRank(member.id, rank)}
                                    className={cn(
                                      'w-full text-left px-3 py-2 text-sm',
                                      'hover:bg-magic-900/50 transition-colors font-display',
                                      getRankColor(rank),
                                      member.rank === rank && 'bg-magic-950/50'
                                    )}
                                  >
                                    {getRankName(rank)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {canKick && (
                          <button
                            onClick={() => handleKickMember(member.id, member.name)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-sm',
                              'bg-red-950/50 text-red-400 border border-red-500/30',
                              'hover:bg-red-900/50 hover:text-red-300 transition-colors font-display'
                            )}
                          >
                            踢出
                          </button>
                        )}
                        
                        {!canManageRank && !canKick && (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        {myRank !== 'president' && (
          <button
            onClick={handleLeaveGuild}
            className={cn(
              'px-6 py-2.5 rounded-lg flex items-center gap-2',
              'bg-red-950/50 text-red-400 border border-red-500/30',
              'hover:bg-red-900/50 hover:text-red-300 transition-colors font-display'
            )}
          >
            <X className="w-4 h-4" />
            退出公会
          </button>
        )}
        {myRank === 'president' && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-arcane-gold" />
            会长无法退出公会，请先转让会长职位
          </div>
        )}
      </div>
    </div>
  );

  const renderJoinRequestsTab = () => {
    if (!myPermissions?.canApproveJoin) {
      return (
        <div className="glass-card p-12 text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="font-display text-xl text-gray-400 mb-2">暂无权限</h3>
          <p className="text-gray-500">你没有审批入会申请的权限</p>
        </div>
      );
    }
    
    if (guild.joinRequests.length === 0) {
      return (
        <div className="glass-card p-12 text-center">
          <UserCheck className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="font-display text-xl text-gray-400 mb-2">暂无入会申请</h3>
          <p className="text-gray-500">还没有玩家申请加入公会</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {guild.joinRequests.map((request) => (
          <div
            key={request.id}
            className="glass-card p-5 border border-magic-500/20 hover:border-magic-500/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-magic-600/40 to-magic-800/40',
                'border border-magic-500/30'
              )}>
                <span className="text-lg font-display text-magic-200">
                  {request.playerName.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-display text-lg text-magic-200">{request.playerName}</h4>
                  <span className="text-sm text-gray-500">Lv.{request.playerLevel}</span>
                </div>
                {request.message && (
                  <p className="text-sm text-gray-400 mt-1">
                    留言：{request.message}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  申请时间：{new Date(request.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => approveJoin(request.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg',
                    'bg-gradient-to-r from-green-600/80 to-green-500/80',
                    'hover:from-green-500 hover:to-green-400',
                    'transition-all duration-300',
                    'font-display text-sm text-white',
                    'active:scale-[0.98]'
                  )}
                >
                  <Check className="w-4 h-4" />
                  通过
                </button>
                <button
                  onClick={() => rejectJoin(request.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg',
                    'bg-red-950/50 text-red-400 border border-red-500/30',
                    'hover:bg-red-900/50 hover:text-red-300 transition-colors font-display'
                  )}
                >
                  <X className="w-4 h-4" />
                  拒绝
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPermissionsTab = () => {
    const ranks: GuildRank[] = ['president', 'vice_president', 'tech_officer', 'member'];
    const permissionKeys = [
      { key: 'canApproveJoin', label: '审批入会' },
      { key: 'canKickMember', label: '踢除成员' },
      { key: 'canEditInfo', label: '编辑信息' },
      { key: 'canUpgradeBuilding', label: '升级建筑' },
      { key: 'canManagePermissions', label: '管理权限' },
    ] as const;
    
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-magic-500/20 bg-magic-950/30">
          <h3 className="font-display text-lg text-magic-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            职位权限说明
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-magic-500/20">
                <th className="text-left py-3 px-4 font-display text-magic-300 text-sm">职位</th>
                {permissionKeys.map(({ key, label }) => (
                  <th key={key} className="text-center py-3 px-4 font-display text-magic-300 text-sm">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank, rankIndex) => {
                const permissions = getPermissionsByRank(rank);
                return (
                  <tr
                    key={rank}
                    className={cn(
                      'border-b border-magic-500/10 hover:bg-magic-950/20 transition-colors',
                      rankIndex === ranks.length - 1 && 'border-b-0'
                    )}
                  >
                    <td className="py-4 px-4">
                      <span className={cn('font-display', getRankColor(rank))}>
                        {getRankName(rank)}
                      </span>
                    </td>
                    {permissionKeys.map(({ key }) => (
                      <td key={key} className="py-4 px-4 text-center">
                        {permissions[key] ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'buildings':
        return renderBuildingsTab();
      case 'members':
        return renderMembersTab();
      case 'joinRequests':
        return renderJoinRequestsTab();
      case 'permissions':
        return renderPermissionsTab();
      default:
        return null;
    }
  };

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      {!hasGuild ? (
        renderCreateGuild()
      ) : (
        <>
          {renderGuildHeader()}
          {renderTabs()}
          {renderTabContent()}
        </>
      )}
    </div>
  );
}
