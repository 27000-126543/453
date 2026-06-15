## 1. 架构设计

```mermaid
flowchart TD
    A["用户浏览器"] --> B["React 18 前端应用"]
    B --> C["状态管理层 (Zustand)"]
    C --> D["游戏核心引擎模块"]
    D --> E["基因组合计算系统"]
    D --> F["培养进度模拟系统"]
    D --> G["随机事件触发系统"]
    D --> H["属性天赋生成系统"]
    C --> I["本地持久化 (localStorage)"]
    B --> J["UI 组件层"]
    J --> K["实验室总览组件"]
    J --> L["基因库组件"]
    J --> M["培养舱组件"]
    J --> N["克隆体图鉴组件"]
    B --> O["可视化层 (Chart.js / Canvas)"]
    O --> P["属性雷达图"]
    O --> Q["魔法粒子背景"]
    O --> R["培养舱动画"]
```

## 2. 技术描述

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：TailwindCSS 3 + CSS Variables (主题系统)
- **状态管理**：Zustand (轻量级状态管理，适合游戏状态)
- **可视化**：Chart.js (雷达图) + 原生 Canvas API (粒子背景、培养舱动画)
- **路由**：React Router v6
- **图标**：Lucide React (配合自定义魔法风格 SVG)
- **字体**：Google Fonts (Cinzel, Cormorant Garamond)
- **后端**：无（单机演示版本，所有数据本地存储）
- **数据存储**：localStorage（持久化玩家进度）

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 实验室总览页面 - 玩家信息、资源、培养舱状态 |
| /gene-bank | 基因库页面 - 基因样本、能量核心、药剂 |
| /incubator | 培养舱页面 - 克隆体配置与实时培养 |
| /collection | 克隆体图鉴页面 - 已培养克隆体管理 |

## 4. 核心数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    PLAYER ||--o{ CLONE : "拥有"
    PLAYER ||--o{ GENE_SAMPLE : "收藏"
    PLAYER ||--o{ ENERGY_CORE : "收藏"
    PLAYER ||--o{ POTION : "持有"
    PLAYER ||--o{ INCUBATION_SESSION : "进行"
    INCUBATION_SESSION ||--o{ CLONE : "生成"
    INCUBATION_SESSION }o--|| GENE_SLOT : "配置"
    GENE_SLOT }o--|| GENE_SAMPLE : "使用"
    INCUBATION_SESSION }o--|| ENERGY_CORE : "使用"
    CLONE ||--o{ TALENT : "拥有"
    CLONE ||--o{ SKILL : "拥有"

    PLAYER {
        string id
        string name
        int level
        int exp
        int skillLevel
        int gold
        int mana
        datetime createdAt
    }

    GENE_SAMPLE {
        string id
        string name
        string race
        string rarity
        json statBonuses
        string description
    }

    ENERGY_CORE {
        string id
        string name
        string element
        string rarity
        int energyConcentration
        json effects
    }

    POTION {
        string id
        string name
        string type
        int growthBoost
        int syncBoost
        int awakeningBoost
        int quantity
    }

    INCUBATION_SESSION {
        string id
        string playerId
        json geneSlots
        string mainCoreId
        string auxCoreId
        float growth
        float syncRate
        float awakening
        string status
        datetime startTime
        datetime lastFeedTime
        json events
    }

    CLONE {
        string id
        string playerId
        string name
        string race
        string element
        json stats
        json talents
        json skills
        float syncRate
        datetime createdAt
    }

    TALENT {
        string id
        string name
        string rarity
        string effect
        string description
    }

    SKILL {
        string id
        string name
        string type
        int cooldown
        int power
        string description
    }
```

### 4.2 核心状态类型定义

```typescript
// 种族枚举
type Race = 'human' | 'elf' | 'orc' | 'dragon' | 'undead' | 'demon';

// 元素枚举
type Element = 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark' | 'chaos';

// 稀有度枚举
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// 培养状态枚举
type IncubationStatus = 'idle' | 'configuring' | 'cultivating' | 'completed' | 'failed';

// 六维属性
interface Stats {
  strength: number;
  agility: number;
  magic: number;
  constitution: number;
  perception: number;
  willpower: number;
}

// 基因样本
interface GeneSample {
  id: string;
  name: string;
  race: Race;
  rarity: Rarity;
  statBonuses: Partial<Stats>;
  traitBonus?: string;
  description: string;
  icon: string;
}

// 能量核心
interface EnergyCore {
  id: string;
  name: string;
  element: Element;
  rarity: Rarity;
  energyConcentration: number;
  effects: {
    statBoost?: Partial<Stats>;
    talentBonus?: number;
    mutationRate?: number;
  };
  description: string;
  icon: string;
}

// 药剂
interface Potion {
  id: string;
  name: string;
  type: 'growth' | 'sync' | 'awakening' | 'catalyst';
  rarity: Rarity;
  effects: {
    growthBoost: number;
    syncBoost: number;
    awakeningBoost: number;
    eventAlteration?: number;
  };
  quantity: number;
  description: string;
  icon: string;
}

// 天赋
interface Talent {
  id: string;
  name: string;
  rarity: Rarity;
  isRare: boolean;
  effect: string;
  statModifiers?: Partial<Stats>;
  description: string;
}

// 技能
interface Skill {
  id: string;
  name: string;
  type: 'active' | 'passive' | 'mutation';
  power: number;
  cooldown: number;
  description: string;
  isMutated: boolean;
}

// 培养会话
interface IncubationSession {
  id: string | null;
  status: IncubationStatus;
  geneSlots: [GeneSample | null, GeneSample | null, GeneSample | null];
  mainCore: EnergyCore | null;
  auxCore: EnergyCore | null;
  growth: number;
  syncRate: number;
  awakening: number;
  startTime: number | null;
  lastFeedTime: number | null;
  events: IncubationEvent[];
  estimatedStats: Stats | null;
  estimatedTalentChance: number;
  estimatedMutationChance: number;
}

// 培养事件
interface IncubationEvent {
  id: string;
  type: 'gene_crash' | 'consciousness_binding' | 'energy_surge' | 'mutation_trigger' | 'stable';
  timestamp: number;
  message: string;
  impact: {
    growth?: number;
    syncRate?: number;
    awakening?: number;
    talentBonus?: number;
  };
}

// 克隆体
interface Clone {
  id: string;
  name: string;
  race: Race;
  element: Element;
  rarity: Rarity;
  stats: Stats;
  talents: Talent[];
  skills: Skill[];
  syncRate: number;
  awakeningLevel: number;
  createdAt: number;
  isFavorite: boolean;
}

// 玩家状态
interface PlayerState {
  id: string;
  name: string;
  level: number;
  exp: number;
  skillLevel: number;
  gold: number;
  mana: number;
  geneSamples: GeneSample[];
  energyCores: EnergyCore[];
  potions: Potion[];
  clones: Clone[];
  currentSession: IncubationSession;
}
```

## 5. 核心算法模块

### 5.1 基因组合属性计算系统

- **基础属性公式**：根据三个基因插槽按权重（40%、35%、25%）叠加属性加成
- **能量浓度修正**：主核心提供 60% 元素加成，辅助核心提供 40%，计算能量浓度倍率
- **技能等级加成**：研究员技能等级每级提供 3% 属性加成和 1.5% 变异概率加成
- **种族协同效应**：同种族基因组合获得 15% 属性加成，跨种族特殊组合触发隐藏属性

### 5.2 培养进度模拟系统

- **时间因子**：基础成长速度 0.5%/秒，受药剂注入频率影响
- **同步率衰减**：超过 30 秒未注入药剂，同步率每秒下降 0.3%
- **觉醒累积**：同步率 > 80% 时觉醒度快速累积，< 50% 时停滞
- **事件触发概率**：基于成长阶段（0-30%: 5%，30-70%: 15%，70-100%: 25%）

### 5.3 天赋生成系统

- **稀有天赋池**：双倍感知、同步超载、基因共鸣、魔力虹吸、灵魂链接等
- **概率计算**：基础 10% + 能量核心加成 + 研究员技能加成 + 觉醒度修正
- **天赋品质**：普通(60%)、稀有(25%)、史诗(12%)、传说(3%)

## 6. 文件结构规划

```
src/
├── assets/
│   ├── fonts/
│   └── icons/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ParticleBackground.tsx
│   ├── lab/
│   │   ├── PlayerCard.tsx
│   │   ├── ResourcePanel.tsx
│   │   └── IncubatorStatus.tsx
│   ├── gene-bank/
│   │   ├── CategoryTabs.tsx
│   │   ├── GeneCard.tsx
│   │   ├── CoreCard.tsx
│   │   └── ItemDetailModal.tsx
│   ├── incubator/
│   │   ├── GeneSlot.tsx
│   │   ├── CoreSlot.tsx
│   │   ├── StatPreview.tsx
│   │   ├── ProgressMonitor.tsx
│   │   ├── PotionInjector.tsx
│   │   └── EventNotification.tsx
│   └── collection/
│       ├── CloneCard.tsx
│       ├── StatRadar.tsx
│       ├── TalentDisplay.tsx
│       └── CloneDetailModal.tsx
├── store/
│   ├── useGameStore.ts
│   └── persist.ts
├── engine/
│   ├── geneCalculator.ts
│   ├── incubationEngine.ts
│   ├── talentGenerator.ts
│   └── eventSystem.ts
├── data/
│   ├── geneSamples.ts
│   ├── energyCores.ts
│   ├── potions.ts
│   ├── talents.ts
│   └── skills.ts
├── types/
│   └── index.ts
├── utils/
│   ├── rarity.ts
│   ├── random.ts
│   └── formatters.ts
├── pages/
│   ├── LabOverview.tsx
│   ├── GeneBank.tsx
│   ├── Incubator.tsx
│   └── Collection.tsx
├── App.tsx
├── main.tsx
└── index.css
```
