/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** JWT令牌信息 */
export interface AuthTokens {
  /**
   * 令牌类型，通常为Bearer
   * @example "Bearer"
   */
  tokenType: string;
  /**
   * Access Token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
   */
  accessToken: string;
  /**
   * Access Token有效期（秒）
   * @format int64
   * @example 3600
   */
  expiresIn: number;
  /**
   * Refresh Token
   * @example "dGhpc19pc19hX3NhbXBsZV9yZWZyZXNoX3Rva2Vu"
   */
  refreshToken: string;
  /**
   * Refresh Token有效期（秒）
   * @format int64
   * @example 604800
   */
  refreshTokenExpiresIn: number;
}

/** 员工基础信息 */
export interface EmployeeProfile {
  /**
   * 员工ID
   * @example "emp_12345"
   */
  id: string;
  /**
   * 员工邮箱
   * @format email
   * @example "employee@example.com"
   */
  email: string;
  /**
   * 员工姓名
   * @example "张三"
   */
  name: string;
  /**
   * 员工角色列表
   * @example ["admin","warehouse_manager"]
   */
  roles: string[];
  /**
   * 上次登录时间
   * @format date-time
   * @example "2024-05-06T03:20:00Z"
   */
  lastLoginAt?: string;
  /**
   * 员工头像链接
   * @format uri
   * @example "https://cdn.example.com/avatar/emp_12345.png"
   */
  avatarUrl?: string;
}

export interface LoginReq {
  /**
   * 员工邮箱
   * @format email
   * @example "employee@example.com"
   */
  email: string;
  /**
   * 登录密码
   * @format password
   * @example "Secret123!"
   */
  password: string;
}

/** @example {"tokens":{"tokenType":"Bearer","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9","expiresIn":3600,"refreshToken":"dGhpc19pc19hX3NhbXBsZV9yZWZyZXNoX3Rva2Vu","refreshTokenExpiresIn":604800},"employee":{"id":"emp_12345","email":"employee@example.com","name":"张三","roles":["admin","warehouse_manager"],"lastLoginAt":"2024-05-06T03:20:00Z","avatarUrl":"https://cdn.example.com/avatar/emp_12345.png"}} */
export interface LoginResp {
  /** JWT令牌信息 */
  tokens: AuthTokens;
  /** 员工基础信息 */
  employee: EmployeeProfile;
}

export interface RefreshTokenReq {
  /**
   * Refresh Token
   * @example "dGhpc19pc19hX3NhbXBsZV9yZWZyZXNoX3Rva2Vu"
   */
  refreshToken: string;
}

export interface LogoutReq {
  /**
   * 需要失效的Refresh Token
   * @example "dGhpc19pc19hX3NhbXBsZV9yZWZyZXNoX3Rva2Vu"
   */
  refreshToken: string;
}

/** @example {"employee":{"id":"emp_12345","email":"employee@example.com","name":"张三","roles":["admin","warehouse_manager"],"lastLoginAt":"2024-05-06T03:20:00Z","avatarUrl":"https://cdn.example.com/avatar/emp_12345.png"}} */
export interface AuthProfileResp {
  /** 员工基础信息 */
  employee: EmployeeProfile;
}

/** 地址 */
export interface Address {
  /** 邮政编码 */
  postalCode?: string;
  /** 详细地址1 */
  detailAddress1?: string;
  /** 详细地址2 */
  detailAddress2?: string;
}

export interface Pagination {
  pagination?: {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    itemsPerPage?: number;
    /** 总数量 */
    totalItems?: number;
    /** 总页数 */
    totalPages?: number;
  };
}

export interface DashboardStats {
  /** 总库存数量 */
  totalInventoryCount?: number;
  /** 本月入库数量 */
  monthlyInboundCount?: number;
  /** 本月出库数量 */
  monthlyOutboundCount?: number;
  /** 待处理入库单数量 */
  pendingInboundCount?: number;
  /** 待处理出库单数量 */
  pendingOutboundCount?: number;
  /** 仓库数量 */
  warehouseCount?: number;
  /** 客户数量 */
  customerCount?: number;
  /** 商品数量 */
  productCount?: number;
}

export type DashboardStatsResp = DashboardStats;

export interface Warehouse {
  /** 仓库ID */
  id?: number;
  /** 仓库名称 */
  name?: string;
  /** 电话 */
  tel?: string;
  /** 传真 */
  fax?: string;
  /** 仓库地址 */
  address?: Address;
}

export type CreateWarehouseReq = Warehouse;

export type CreateWarehouseResp = Warehouse;

export type GetWarehouseResp = Warehouse;

export type ListWarehousesResp = Pagination & {
  items?: Warehouse[];
};

export interface Product {
  /** 商品ID */
  id?: number;
  /** 商品名 */
  name?: string;
  /** 商品SKU */
  sku?: string;
  /** 最小商品种类ID */
  leafCategory?: ProductCategory;
  /** 商品种类路径 */
  categoryRoute?: ProductCategory[];
  /** 货物标记 */
  cargoMark?: string;
  /** 商品图片列表 */
  images?: ProductImage[];
  dimension?: {
    /** 尺寸描述 */
    description?: string;
    /** 长度 */
    length?: number;
    /** 宽度 */
    width?: number;
    /** 高度 */
    height?: number;
    /** 长度单位 */
    lengthUnit?: "mm" | "cm" | "m";
    /** 单件重量 */
    unitWeight?: number;
    /** 总重量 */
    totalWeight?: number;
    /** 重量单位 */
    weightUnit?: "kg" | "g";
  };
  /** 是否存在子包装 */
  hasSubPackage?: boolean;
  /** 子包装数量 */
  subPackageCount?: number;
  /** 是否固定重量 */
  isFixedWeight?: boolean;
  /** 是否激活 */
  isActive?: boolean;
}

export interface ProductImage {
  /** 商品图片记录ID */
  id?: string;
  /** 媒体图片ID，用于通过媒体服务访问 */
  mediaId: string;
  /** 图片顺序，值越小越靠前 */
  order?: number;
  /** 图片替代文本 */
  altText?: string;
}

export interface ProductCategory {
  /** 商品种类ID */
  id?: number;
  /** 父商品种类ID */
  parentId?: number;
  /** 商品种类名称 */
  name?: string;
}

export type CreateProductReq = Product;

export type CreateProductResp = Product;

export type GetProductResp = Product;

export type ListProductsResp = Pagination & {
  items?: Product[];
};

export interface UploadedImage {
  /** 媒体图片ID，用于后续访问或绑定商品 */
  mediaId: string;
  /**
   * 图片访问地址（通过媒体服务代理访问，可能受权限控制）
   * @format uri
   */
  url?: string;
  /** 原始文件名 */
  fileName?: string;
  /** 文件MIME类型 */
  contentType?: string;
  /**
   * 文件大小（字节）
   * @format int64
   */
  size?: number;
}

export interface Customer {
  /** 客户ID */
  id?: number;
  /** 客户名 */
  name?: string;
  /** 电话 */
  tel?: string;
  /** 传真 */
  fax?: string;
  /** 地址 */
  address?: Address;
  contact?: CustomerContact;
}

export type CreateCustomerReq = Customer;

export type CreateCustomerResp = Customer;

export type GetCustomerResp = Customer;

export type ListCustomersResp = Pagination & {
  items?: Customer[];
};

export interface CustomerContact {
  /** 联系人ID */
  id?: number;
  /** 客户ID */
  customerId?: number;
  /** 联系人名 */
  name?: string;
  /** 电话 */
  tel?: string;
  /** 邮箱 */
  email?: string;
}

export interface InventoryItem {
  /** 库存物品ID */
  id?: number;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /** 入库订单ID */
  inboundOrderId?: string;
  /** 入库记录ID */
  inboundId?: number;
  /** 入库物品ID */
  inboundItemId?: number;
  /** 入库日期 */
  inboundDate?: string;
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
    dimension?: {
      /** 尺寸描述 */
      description?: string;
      /** 长度 */
      length?: number;
      /** 宽度 */
      width?: number;
      /** 高度 */
      height?: number;
      /** 长度单位 */
      lengthUnit?: "cm" | "m";
      /** 重量 */
      weight?: number;
      /** 重量单位 */
      weightUnit?: "kg" | "g";
    };
  };
  /** 单品重量 */
  perItemWeight?: number;
  /** 单品重量单位 */
  perItemWeightUnit?: string;
  /** 总重量 */
  totalWeight?: number;
  /**
   * 生产日期
   * @format date
   */
  manufactureDate?: string;
  /**
   * 最佳风味期限
   * @format date
   */
  bestBeforeDate?: string;
  /** 批次号 */
  lotNumber?: string;
  /** 船名 */
  shipName?: string;
  /** 入库数量 */
  inboundQuantity?: number;
  /** 剩余数量 */
  leftQuantity?: number;
  /** 剩余子件数 */
  leftSubQuantity?: number;
  /** 是否静音 */
  muted?: boolean;
}

export type InventoryItemDetailResp = InventoryItem & {
  inboundItem?: InboundItem;
  outboundItems?: OutboundItem[];
  nameChangeItems?: NameChangeItem[];
};

export type AgedInventoryItemListResp = Pagination & {
  items?: InventoryItem[];
};

export type ListInventoryResp = Pagination & {
  items?: InventoryItem[];
};

export interface StorageFeePlan {
  /** 保管费用计划ID */
  id?: number;
  /** 开始日期 */
  fromDate?: string;
  /** 付款方名称 */
  payerName?: string;
}

export interface Inbound {
  /** 入库记录ID */
  id?: number;
  /** 入库订单ID */
  inboundOrderId?: string;
  /**
   * 入库日期
   * @format date
   */
  inboundDate?: string;
  /** 客户订单号 */
  customerOrderId?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /** 入库物品列表 */
  items?: InboundItem[];
  /** 保管费用计划列表 */
  storageFeePlans?: StorageFeePlan[];
  /** 入库状态 */
  status?: "draft" | "pending" | "approved" | "rejected" | "cancelled";
  /** 创建时间 */
  createdAt?: string;
}

export type ListInboundsResp = Pagination & {
  items?: Inbound[];
};

export type ListInboundItemsResp = Pagination & {
  items?: InboundItem[];
};

export interface InboundItem {
  /** 入库物品ID */
  id?: number;
  /** 入库记录ID */
  inboundId?: number;
  inbound?: {
    /** 入库记录ID */
    id?: number;
    /** 入库订单ID */
    inboundOrderId?: string;
    /** 入库日期 */
    inboundDate?: string;
    warehouse?: {
      /** 仓库ID */
      id?: number;
      /** 仓库名称 */
      name?: string;
    };
  };
  /** 商品ID */
  productId?: number;
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
  };
  /** 入库数量 */
  quantity?: number;
  /** 单品重量 */
  perItemWeight?: number;
  /** 单品重量单位 */
  perItemWeightUnit?: string;
  /** 总重量 */
  totalWeight?: number;
  /**
   * 生产日期
   * @format date
   */
  manufactureDate?: string;
  /**
   * 最佳风味期限
   * @format date
   */
  bestBeforeDate?: string;
  /** 批次号 */
  lotNumber?: string;
  /** 船名 */
  shipName?: string;
}

export interface Outbound {
  /** 出库记录ID */
  id?: number;
  /** 出库订单ID */
  outboundOrderId?: string;
  /**
   * 出库日期
   * @format date
   */
  outboundDate?: string;
  /** 出库时间 */
  outboundTime?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /** 客户联系人ID */
  customerContactId?: number;
  /** 承运商名称 */
  carrierName?: string;
  /** 出库物品列表 */
  items?: OutboundItem[];
  /** 出库状态 */
  status?: "draft" | "pending" | "approved" | "rejected" | "cancelled";
  /**
   * 结算币种，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 商品小计金额
   * @format float
   */
  subtotalAmount?: number;
  /**
   * 税额
   * @format float
   */
  taxAmount?: number;
  /**
   * 总金额
   * @format float
   */
  totalAmount?: number;
  /** 创建时间 */
  createdAt?: string;
}

export type ListOutboundsResp = Pagination & {
  items?: Outbound[];
};

export type ListOutboundItemsResp = Pagination & {
  items?: OutboundItem[];
};

export interface OutboundItem {
  /** 出库物品ID */
  id?: number;
  /** 出库记录ID */
  outboundId?: number;
  outbound?: {
    /** 出库记录ID */
    id?: number;
    /** 出库订单ID */
    outboundOrderId?: string;
    /**
     * 出库日期
     * @format date
     */
    outboundDate?: string;
    warehouse?: {
      /** 仓库ID */
      id?: number;
      /** 仓库名称 */
      name?: string;
    };
    customer?: {
      /** 客户ID */
      id?: number;
      /** 客户名称 */
      name?: string;
    };
  };
  /** 入库物品ID */
  inboundItemId?: number;
  /** 库存物品ID */
  inventoryItemId?: number;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
    dimension?: {
      /** 尺寸描述 */
      description?: string;
      /** 长度 */
      length?: number;
      /** 宽度 */
      width?: number;
      /** 高度 */
      height?: number;
      /** 长度单位 */
      lengthUnit?: "cm" | "m";
      /** 重量 */
      weight?: number;
      /** 重量单位 */
      weightUnit?: "kg" | "g";
    };
  };
  /** 批次号 */
  lotNumber?: string;
  /** 库存数量 */
  inventoryQuantity?: number;
  /** 出库数量 */
  quantity?: number;
  /**
   * 商品单价
   * @format float
   */
  unitPrice?: number;
  /**
   * 结算币种，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 行金额
   * @format float
   */
  lineAmount?: number;
  /**
   * 行税额
   * @format float
   */
  taxAmount?: number;
  /** 备注 */
  note?: string;
}

export interface InventoryReportReq {
  /** 仓库ID */
  warehouseId: number;
  /** 客户ID */
  customerId: number;
  /**
   * 报告格式
   * @default "pdf"
   */
  format?: "pdf" | "excel";
}

export interface InventoryReportResp {
  /** 报告ID */
  reportId?: string;
  /**
   * 报告生成时间
   * @format date-time
   */
  reportDate?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface InventoryReport {
  /** 报告ID */
  id?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 报告日期
   * @format date
   */
  reportDate?: string;
  /** 报告格式 */
  format?: "pdf" | "excel";
  /** 报告状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 报告下载URL（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 报告创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 报告完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type InventoryReportListResp = Pagination & {
  items?: InventoryReport[];
};

export interface InboundReportReq {
  /** 入库记录ID */
  inboundId: number;
  /**
   * 报告格式
   * @default "pdf"
   */
  format?: "pdf" | "excel";
}

export interface InboundReportResp {
  /** 入库报告ID */
  reportId?: string;
  /**
   * 报告生成时间
   * @format date-time
   */
  reportDate?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface InboundReport {
  /** 入库报告ID */
  id?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 报告日期
   * @format date
   */
  reportDate?: string;
  /** 报告格式 */
  format?: "pdf" | "excel";
  /** 报告状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 报告下载URL（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 报告创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 报告完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type InboundReportListResp = Pagination & {
  items?: InboundReport[];
};

export interface OutboundReportReq {
  /** 出库记录ID */
  outboundId: number;
  /**
   * 报告格式
   * @default "pdf"
   */
  format?: "pdf" | "excel";
}

export interface OutboundReportResp {
  /** 出库报告ID */
  reportId?: string;
  /**
   * 报告生成时间
   * @format date-time
   */
  reportDate?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface OutboundReport {
  /** 出库报告ID */
  id?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 报告日期
   * @format date
   */
  reportDate?: string;
  /** 报告格式 */
  format?: "pdf" | "excel";
  /** 报告状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 报告下载URL（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 报告创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 报告完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type OutboundReportListResp = Pagination & {
  items?: OutboundReport[];
};

export interface NameChange {
  /** 名义变更记录ID */
  id?: number;
  /** 名义变更订单ID */
  nameChangeOrderId?: string;
  /**
   * 名义变更日期
   * @format date
   */
  nameChangeDate?: string;
  /** 名义变更时间 */
  nameChangeTime?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /** 客户联系人ID */
  customerContactId?: number;
  /** 名义变更物品列表 */
  items?: NameChangeItem[];
  /** 名义变更状态 */
  status?: "draft" | "pending" | "approved" | "rejected" | "cancelled";
}

export type ListNameChangesResp = Pagination & {
  items?: NameChange[];
};

export type ListNameChangeItemsResp = Pagination & {
  items?: NameChangeItem[];
};

export interface NameChangeItem {
  /** 名义变更物品ID */
  id?: number;
  /** 名义变更记录ID */
  nameChangeId?: number;
  nameChange?: {
    /** 名义变更记录ID */
    id?: number;
    /** 名义变更订单ID */
    nameChangeOrderId?: string;
    /**
     * 名义变更日期
     * @format date
     */
    nameChangeDate?: string;
    warehouse?: {
      /** 仓库ID */
      id?: number;
      /** 仓库名称 */
      name?: string;
    };
    customer?: {
      /** 客户ID */
      id?: number;
      /** 客户名称 */
      name?: string;
    };
  };
  /** 入库物品ID */
  inboundItemId?: number;
  /** 库存物品ID */
  inventoryItemId?: number;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
    dimension?: {
      /** 尺寸描述 */
      description?: string;
      /** 长度 */
      length?: number;
      /** 宽度 */
      width?: number;
      /** 高度 */
      height?: number;
      /** 长度单位 */
      lengthUnit?: "cm" | "m";
      /** 重量 */
      weight?: number;
      /** 重量单位 */
      weightUnit?: "kg" | "g";
    };
  };
  /** 批次号 */
  lotNumber?: string;
  /** 库存数量 */
  inventoryQuantity?: number;
  /** 名义变更数量 */
  quantity?: number;
  /** 备注 */
  note?: string;
}

export interface NameChangeReportReq {
  /** 名义变更记录ID */
  nameChangeId: number;
  /**
   * 报告格式
   * @default "pdf"
   */
  format?: "pdf" | "excel";
}

export interface NameChangeReportResp {
  /** 名义变更报告ID */
  reportId?: string;
  /**
   * 报告生成时间
   * @format date-time
   */
  reportDate?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface NameChangeReport {
  /** 名义变更报告ID */
  id?: string;
  warehouse?: {
    /** 仓库ID */
    id?: number;
    /** 仓库名称 */
    name?: string;
  };
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 报告日期
   * @format date
   */
  reportDate?: string;
  /** 报告格式 */
  format?: "pdf" | "excel";
  /** 报告状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 报告下载URL（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 报告创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 报告完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type NameChangeReportListResp = Pagination & {
  items?: NameChangeReport[];
};

export interface Invoice {
  /** 发票ID */
  id?: number;
  /** 发票编号 */
  invoiceNumber?: string;
  /** 发票状态 */
  status?: "draft" | "issued" | "cancelled" | "paid";
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 付款截止日期
   * @format date
   */
  dueDate?: string;
  /**
   * 发票下发时间
   * @format date-time
   */
  issueDate?: string;
  /**
   * 结算币种，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 商品小计金额
   * @format float
   */
  subtotalAmount?: number;
  /**
   * 税额
   * @format float
   */
  taxAmount?: number;
  /**
   * 总金额
   * @format float
   */
  totalAmount?: number;
  /** 关联的出库单ID */
  outboundId?: number;
  /** 发票明细行 */
  items?: InvoiceLineItem[];
  /** 备注 */
  notes?: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt?: string;
}

export interface InvoiceLineItem {
  /** 发票明细ID */
  id?: number;
  /** 出库记录ID */
  outboundId?: number;
  /** 出库订单编号 */
  outboundOrderId?: string;
  /**
   * 出库日期
   * @format date
   */
  outboundDate?: string;
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
  };
  /** 计费数量 */
  quantity?: number;
  /**
   * 计费单价
   * @format float
   */
  unitPrice?: number;
  /**
   * 结算币种，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 行金额
   * @format float
   */
  lineAmount?: number;
  /**
   * 行税额
   * @format float
   */
  taxAmount?: number;
  /** 备注 */
  note?: string;
}

export interface CreateInvoiceReq {
  /** 客户ID */
  customerId: number;
  /** 需要生成发票的出库单ID */
  outboundId: number;
  /**
   * 付款截止日期
   * @format date
   */
  dueDate?: string;
  /**
   * 结算币种，仅支持JPY，缺省为JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 创建后是否自动下发
   * @default false
   */
  autoIssue?: boolean;
  /** 补充说明 */
  notes?: string;
}

export type ListInvoicesResp = Pagination & {
  items?: Invoice[];
};

export interface IssueInvoiceReq {
  /**
   * 发票下发时间
   * @format date-time
   */
  issueDate?: string;
  /** 下发时附带的消息 */
  message?: string;
}

export interface CancelInvoiceReq {
  /** 取消原因 */
  reason?: string;
}

export interface InvoicePrintReq {
  /** 需要生成打印版的发票ID */
  invoiceId: number;
  /**
   * 打印文件格式
   * @default "excel"
   */
  format?: "excel";
}

export interface InvoicePrintResp {
  /** 打印任务ID */
  printId?: string;
  /** 发票关键信息 */
  invoice?: {
    /** 发票ID */
    id?: number;
    /** 发票编号 */
    invoiceNumber?: string;
    /** 发票状态 */
    status?: "draft" | "issued" | "cancelled" | "paid";
  };
  /** 打印文件格式 */
  format?: "excel";
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface InvoicePrint {
  /** 发票打印任务ID */
  id?: string;
  /** 发票关键信息 */
  invoice?: {
    /** 发票ID */
    id?: number;
    /** 发票编号 */
    invoiceNumber?: string;
    /** 发票状态 */
    status?: "draft" | "issued" | "cancelled" | "paid";
    /** 发票对应客户信息 */
    customer?: {
      /** 客户ID */
      id?: number;
      /** 客户名称 */
      name?: string;
    };
    /**
     * 付款截止日期
     * @format date
     */
    dueDate?: string;
    /**
     * 发票下发时间
     * @format date-time
     */
    issueDate?: string;
    /** 结算币种 */
    currency?: string;
    /**
     * 商品小计金额
     * @format float
     */
    subtotalAmount?: number;
    /**
     * 税额
     * @format float
     */
    taxAmount?: number;
    /**
     * 总金额
     * @format float
     */
    totalAmount?: number;
  };
  /** 打印文件格式 */
  format?: "excel";
  /** 打印任务状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 下载链接（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 任务创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 任务完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type InvoicePrintListResp = Pagination & {
  items?: InvoicePrint[];
};

export interface Order {
  /** 注文ID */
  id?: number;
  /** 注文编号 */
  orderNumber?: string;
  /** 状态 */
  status?: "draft" | "requested" | "sent" | "completed" | "cancelled";
  /** 客户信息 */
  customer?: {
    /** 客户ID */
    id?: number;
    /** 客户名称 */
    name?: string;
  };
  /**
   * 纳期
   * @format date
   */
  deliveryDueDate?: string;
  /** 地址 */
  deliveryAddress?: Address;
  /** 负责人姓名 */
  contactName?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 注文明细列表 */
  items?: OrderItem[];
  /**
   * 总金额（未含税）
   * @format float
   */
  totalAmount?: number;
  /**
   * 货币，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /** 备注 */
  notes?: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt?: string;
}

export interface OrderItem {
  /** 注文明细ID */
  id?: number;
  /** 商品信息 */
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
    /** 商品SKU */
    sku?: string;
  };
  /**
   * 订购数量
   * @format float
   */
  quantity?: number;
  /** 计量单位 */
  unit?: string;
  /**
   * 单价（未含税）
   * @format float
   */
  unitPrice?: number;
  /**
   * 货币，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /**
   * 明细金额（未含税）
   * @format float
   */
  lineAmount?: number;
  /** 明细备注 */
  note?: string;
}

export interface OrderItemInput {
  /** 商品ID */
  productId: number;
  /**
   * 订购数量
   * @format float
   */
  quantity: number;
  /** 计量单位 */
  unit: string;
  /**
   * 单价（未含税）
   * @format float
   */
  unitPrice: number;
  /**
   * 货币，仅支持JPY
   * @default "JPY"
   */
  currency?: "JPY";
  /** 明细备注 */
  note?: string;
}

export interface CreateOrderReq {
  /** 客户ID */
  customerId: number;
  /**
   * 纳期
   * @format date
   */
  deliveryDueDate: string;
  /** 地址 */
  deliveryAddress: Address;
  /** 负责人姓名 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /**
   * 注文明细
   * @minItems 1
   */
  items: OrderItemInput[];
  /** 备注 */
  notes?: string;
}

/** 注文更新请求，可部分更新字段 */
export interface UpdateOrderReq {
  /**
   * 纳期
   * @format date
   */
  deliveryDueDate?: string;
  /** 地址 */
  deliveryAddress?: Address;
  /** 负责人姓名 */
  contactName?: string;
  /** 联系电话 */
  contactPhone?: string;
  /**
   * 注文明细
   * @minItems 1
   */
  items?: OrderItemInput[];
  /** 备注 */
  notes?: string;
}

export type ListOrdersResp = Pagination & {
  items?: Order[];
};

export interface OrderPrintReq {
  /** 需要生成打印版的注文ID */
  orderId: number;
  /**
   * 打印文件格式
   * @default "excel"
   */
  format?: "excel";
}

export interface OrderPrintResp {
  /** 打印任务ID */
  printId?: string;
  /** 注文关键信息 */
  order?: {
    /** 注文ID */
    id?: number;
    /** 注文编号 */
    orderNumber?: string;
    /** 注文状态 */
    status?: "draft" | "requested" | "sent" | "completed" | "cancelled";
  };
  /** 打印文件格式 */
  format?: "excel";
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export interface OrderPrint {
  /** 注文打印任务ID */
  id?: string;
  /** 注文关键信息 */
  order?: {
    /** 注文ID */
    id?: number;
    /** 注文编号 */
    orderNumber?: string;
    /** 注文状态 */
    status?: "draft" | "requested" | "sent" | "completed" | "cancelled";
    /** 客户信息 */
    customer?: {
      /** 客户ID */
      id?: number;
      /** 客户名称 */
      name?: string;
    };
    /**
     * 纳期
     * @format date
     */
    deliveryDueDate?: string;
    /** 负责人姓名 */
    contactName?: string;
    /** 联系电话 */
    contactPhone?: string;
  };
  /** 打印文件格式 */
  format?: "excel";
  /** 打印任务状态 */
  status?: "pending" | "processing" | "completed" | "failed";
  /** 下载链接（仅在completed状态时提供） */
  downloadUrl?: string;
  /** 错误信息（仅在failed状态时提供） */
  errorMessage?: string;
  /**
   * 任务创建时间
   * @format date-time
   */
  createdAt?: string;
  /**
   * 任务完成时间
   * @format date-time
   */
  completedAt?: string;
  /**
   * 下载链接过期时间
   * @format date-time
   */
  expiresAt?: string;
}

export type OrderPrintListResp = Pagination & {
  items?: OrderPrint[];
};

export interface Container {
  /** 集装箱ID */
  id?: number;
  /** 集装箱号 */
  containerNumber?: string;
  /** 船公司 */
  shippingLine?: string;
  /** 船名 */
  vesselName?: string;
  /** 航次号 */
  voyageNumber?: string;
  /**
   * 到港日期
   * @format date
   */
  arrivalDate?: string;
  /**
   * 清关日期
   * @format date
   */
  clearanceDate?: string;
  /**
   * 卸货日期
   * @format date
   */
  dischargeDate?: string;
  /**
   * 空箱归还日期
   * @format date
   */
  returnDate?: string;
  /** 集装箱物品列表 */
  items?: ContainerItem[];
  /**
   * 集装箱状态
   * shipping: 在途
   * arrived: 已到港
   * customsClearance: 清关中
   * discharging: 卸货中
   * discharged: 已卸货
   * empty: 空箱
   * returned: 已归还
   * canceled: 已取消
   */
  status?:
    | "shipping"
    | "arrived"
    | "customsClearance"
    | "discharging"
    | "discharged"
    | "empty"
    | "returned"
    | "canceled";
}

export interface ContainerItem {
  /** 集装箱货物ID */
  id?: number;
  /** 集装箱ID */
  containerId?: number;
  container?: Container;
  /** 货物ID */
  productId?: number;
  product?: {
    /** 商品ID */
    id?: number;
    /** 商品名称 */
    name?: string;
  };
  /** 数量 */
  quantity?: number;
  /**
   * 生产日期
   * @format date
   */
  manufactureDate?: string;
  /**
   * 最佳风味期限
   * @format date
   */
  bestBeforeDate?: string;
}

export type ListContainersResp = Pagination & {
  items?: Container[];
};

export type CreateContainerReq = Container;

export type CreateContainerResp = Container;

export type GetContainerResp = Container;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://development.gigantic-server.com/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
                                              body,
                                              secure,
                                              path,
                                              type,
                                              query,
                                              format,
                                              baseUrl,
                                              cancelToken,
                                              ...params
                                            }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
          .then((data) => {
            if (r.ok) {
              r.data = data;
            } else {
              r.error = data;
            }
            return r;
          })
          .catch((e) => {
            r.error = e;
            return r;
          });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title 库存管理系统接口
 * @version 0.0.1
 * @baseUrl https://development.gigantic-server.com/v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags 认证
     * @name Login
     * @summary 用户登录
     * @request POST:/auth/login
     * @secure
     */
    login: (data: LoginReq, params: RequestParams = {}) =>
      this.request<LoginResp, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 认证
     * @name RefreshToken
     * @summary 刷新访问令牌
     * @request POST:/auth/refresh
     * @secure
     */
    refreshToken: (data: RefreshTokenReq, params: RequestParams = {}) =>
      this.request<LoginResp, any>({
        path: `/auth/refresh`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 认证
     * @name Logout
     * @summary 用户登出
     * @request POST:/auth/logout
     * @secure
     */
    logout: (data: LogoutReq, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/logout`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 认证
     * @name GetAuthProfile
     * @summary 获取当前登录员工信息
     * @request GET:/auth/profile
     * @secure
     */
    getAuthProfile: (params: RequestParams = {}) =>
      this.request<AuthProfileResp, any>({
        path: `/auth/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  dashboard = {
    /**
     * No description
     *
     * @tags 仪表盘
     * @name GetDashboardStats
     * @summary 获取仪表盘统计数据
     * @request GET:/dashboard/stats
     * @secure
     */
    getDashboardStats: (params: RequestParams = {}) =>
      this.request<DashboardStatsResp, any>({
        path: `/dashboard/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  warehouses = {
    /**
     * No description
     *
     * @tags 仓库
     * @name ListWarehouses
     * @summary 仓库列表
     * @request GET:/warehouses
     * @secure
     */
    listWarehouses: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库名称 */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListWarehousesResp, any>({
        path: `/warehouses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  warehouse = {
    /**
     * No description
     *
     * @tags 仓库
     * @name CreateWarehouse
     * @summary 创建新的仓库
     * @request POST:/warehouse
     * @secure
     */
    createWarehouse: (data: CreateWarehouseReq, params: RequestParams = {}) =>
      this.request<CreateWarehouseResp, any>({
        path: `/warehouse`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 仓库
     * @name GetWarehouse
     * @summary 获取仓库详情
     * @request GET:/warehouse/{id}
     * @secure
     */
    getWarehouse: (id: number, params: RequestParams = {}) =>
      this.request<GetWarehouseResp, any>({
        path: `/warehouse/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 仓库
     * @name UpdateWarehouse
     * @summary 更新仓库
     * @request PUT:/warehouse/{id}
     * @secure
     */
    updateWarehouse: (id: number, data: Warehouse, params: RequestParams = {}) =>
      this.request<GetWarehouseResp, any>({
        path: `/warehouse/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 仓库
     * @name DeleteWarehouse
     * @summary 删除仓库
     * @request DELETE:/warehouse/{id}
     * @secure
     */
    deleteWarehouse: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/warehouse/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  products = {
    /**
     * No description
     *
     * @tags 商品
     * @name ListProducts
     * @summary 获取商品列表
     * @request GET:/products
     * @secure
     */
    listProducts: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 商品名称 */
        name?: string;
        /** 商品SKU */
        sku?: string;
        /** 是否激活 */
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListProductsResp, any>({
        path: `/products`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  product = {
    /**
     * No description
     *
     * @tags 商品
     * @name CreateProduct
     * @summary 创建商品
     * @request POST:/product
     * @secure
     */
    createProduct: (data: CreateProductReq, params: RequestParams = {}) =>
      this.request<CreateProductResp, any>({
        path: `/product`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 商品
     * @name GetProduct
     * @summary 获取商品详情
     * @request GET:/product/{id}
     * @secure
     */
    getProduct: (id: number, params: RequestParams = {}) =>
      this.request<GetProductResp, any>({
        path: `/product/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 商品
     * @name UpdateProduct
     * @summary 更新商品
     * @request PUT:/product/{id}
     * @secure
     */
    updateProduct: (id: number, data: Product, params: RequestParams = {}) =>
      this.request<GetProductResp, any>({
        path: `/product/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 商品
     * @name DeleteProduct
     * @summary 删除商品
     * @request DELETE:/product/{id}
     * @secure
     */
    deleteProduct: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/product/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  media = {
    /**
     * No description
     *
     * @tags 媒体
     * @name UploadMediaImage
     * @summary 上传图片
     * @request POST:/media/images
     * @secure
     */
    uploadMediaImage: (
      data: {
        /**
         * 图片文件
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadedImage, any>({
        path: `/media/images`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 媒体
     * @name GetMediaImage
     * @summary 获取图片内容
     * @request GET:/media/images/{imageId}
     * @secure
     */
    getMediaImage: (imageId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/media/images/${imageId}`,
        method: "GET",
        secure: true,
        format: "blob",
        ...params,
      }),
  };
  customers = {
    /**
     * No description
     *
     * @tags 客户
     * @name ListCustomers
     * @summary 获取客户列表
     * @request GET:/customers
     * @secure
     */
    listCustomers: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 客户名 */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListCustomersResp, any>({
        path: `/customers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  customer = {
    /**
     * No description
     *
     * @tags 客户
     * @name CreateCustomer
     * @summary 创建客户
     * @request POST:/customer
     * @secure
     */
    createCustomer: (data: CreateCustomerReq, params: RequestParams = {}) =>
      this.request<CreateCustomerResp, any>({
        path: `/customer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 客户
     * @name GetCustomer
     * @summary 获取客户详情
     * @request GET:/customer/{id}
     * @secure
     */
    getCustomer: (id: number, params: RequestParams = {}) =>
      this.request<GetCustomerResp, any>({
        path: `/customer/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 客户
     * @name UpdateCustomer
     * @summary 更新客户
     * @request PUT:/customer/{id}
     * @secure
     */
    updateCustomer: (id: number, data: Customer, params: RequestParams = {}) =>
      this.request<GetCustomerResp, any>({
        path: `/customer/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 客户
     * @name DeleteCustomer
     * @summary 删除客户
     * @request DELETE:/customer/{id}
     * @secure
     */
    deleteCustomer: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/customer/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  inventory = {
    /**
     * No description
     *
     * @tags 库存
     * @name ListInbounds
     * @summary 入库单列表
     * @request GET:/inventory/inbounds
     * @secure
     */
    listInbounds: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 入库订单ID */
        inboundOrderId?: string;
        /**
         * 入库日期(From)
         * @format date
         */
        inboundDateFrom?: string;
        /**
         * 入库日期(To)
         * @format date
         */
        inboundDateTo?: string;
        /** 仓库ID */
        warehouseId?: number;
        /** 入库状态 */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListInboundsResp, any>({
        path: `/inventory/inbounds`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CreateInbound
     * @summary 创建入库单
     * @request POST:/inventory/inbound
     * @secure
     */
    createInbound: (data: Inbound, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name GetInbound
     * @summary 入库单详情
     * @request GET:/inventory/inbound/{id}
     * @secure
     */
    getInbound: (id: number, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name UpdateInbound
     * @summary 更新入库单
     * @request PUT:/inventory/inbound/{id}
     * @secure
     */
    updateInbound: (id: number, data: Inbound, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name DeleteInbound
     * @summary 删除入库单
     * @request DELETE:/inventory/inbound/{id}
     * @secure
     */
    deleteInbound: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/inventory/inbound/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ApproveInbound
     * @summary 确认入库单
     * @request POST:/inventory/inbound/{id}/approve
     * @secure
     */
    approveInbound: (id: number, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound/${id}/approve`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name RejectInbound
     * @summary 拒绝入库单
     * @request POST:/inventory/inbound/{id}/reject
     * @secure
     */
    rejectInbound: (id: number, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound/${id}/reject`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CancelInbound
     * @summary 取消入库单
     * @request POST:/inventory/inbound/{id}/cancel
     * @secure
     */
    cancelInbound: (id: number, params: RequestParams = {}) =>
      this.request<Inbound, any>({
        path: `/inventory/inbound/${id}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListInboundItems
     * @summary 入库商品列表
     * @request GET:/inventory/inboundItems
     * @secure
     */
    listInboundItems: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 批次号 */
        lotNumber?: string;
        /** 商品ID */
        productId?: number;
        /**
         * 入库日期(From)
         * @format date
         */
        inboundDateFrom?: string;
        /**
         * 入库日期(To)
         * @format date
         */
        inboundDateTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListInboundItemsResp, any>({
        path: `/inventory/inboundItems`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListOutbounds
     * @summary 出库单列表
     * @request GET:/inventory/outbounds
     * @secure
     */
    listOutbounds: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOutboundsResp, any>({
        path: `/inventory/outbounds`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CreateOutbound
     * @summary 创建出库单
     * @request POST:/inventory/outbound
     * @secure
     */
    createOutbound: (data: Outbound, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name GetOutbound
     * @summary 出库单详情
     * @request GET:/inventory/outbound/{id}
     * @secure
     */
    getOutbound: (id: number, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name UpdateOutbound
     * @summary 更新出库单
     * @request PUT:/inventory/outbound/{id}
     * @secure
     */
    updateOutbound: (id: number, data: Outbound, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name DeleteOutbound
     * @summary 删除出库单
     * @request DELETE:/inventory/outbound/{id}
     * @secure
     */
    deleteOutbound: (id: number, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/inventory/outbound/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ApproveOutbound
     * @summary 确认出库单
     * @request POST:/inventory/outbound/{id}/approve
     * @secure
     */
    approveOutbound: (id: number, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound/${id}/approve`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name RejectOutbound
     * @summary 拒绝出库单
     * @request POST:/inventory/outbound/{id}/reject
     * @secure
     */
    rejectOutbound: (id: number, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound/${id}/reject`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CancelOutbound
     * @summary 取消出库单
     * @request POST:/inventory/outbound/{id}/cancel
     * @secure
     */
    cancelOutbound: (id: number, params: RequestParams = {}) =>
      this.request<Outbound, any>({
        path: `/inventory/outbound/${id}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListOutboundItems
     * @summary 出库商品列表
     * @request GET:/inventory/outboundItems
     * @secure
     */
    listOutboundItems: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 批次号 */
        lotNumber?: string;
        /** 商品ID */
        productId?: number;
        /**
         * 出库日期(From)
         * @format date
         */
        outboundDateFrom?: string;
        /**
         * 出库日期(To)
         * @format date
         */
        outboundDateTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOutboundItemsResp, any>({
        path: `/inventory/outboundItems`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListInventory
     * @summary 库存列表
     * @request GET:/inventory/list
     * @secure
     */
    listInventory: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库ID */
        warehouseId?: number;
        /** 客户ID */
        customerId?: number;
        /** 商品ID */
        productId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListInventoryResp, any>({
        path: `/inventory/list`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name GetInventoryItemDetail
     * @summary 获取库存物品详情
     * @request GET:/inventory/item/{id}
     * @secure
     */
    getInventoryItemDetail: (id: number, params: RequestParams = {}) =>
      this.request<InventoryItemDetailResp, any>({
        path: `/inventory/item/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 仪表盘
     * @name GetAgedInventoryItemList
     * @summary 获取库存过久商品列表
     * @request GET:/inventory/agedItems
     * @secure
     */
    getAgedInventoryItemList: (params: RequestParams = {}) =>
      this.request<AgedInventoryItemListResp, any>({
        path: `/inventory/agedItems`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name MuteAgedInventoryItem
     * @summary 静音库存物品
     * @request POST:/inventory/agedItems/{id}/mute
     * @secure
     */
    muteAgedInventoryItem: (id: number, params: RequestParams = {}) =>
      this.request<InventoryItem, any>({
        path: `/inventory/agedItems/${id}/mute`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取在库报告的历史列表，支持按仓库、客户等条件筛选。
     *
     * @tags 库存报告
     * @name ListInventoryReports
     * @summary 获取在库报告列表
     * @request GET:/inventory/reports
     * @secure
     */
    listInventoryReports: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库ID筛选 */
        warehouseId?: number;
        /** 客户ID筛选 */
        customerId?: number;
        /** 报告状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（报告生成时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（报告生成时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<InventoryReportListResp, any>({
        path: `/inventory/reports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定仓库和客户的在库报告PDF。 报告将异步生成，返回报告ID用于查询生成状态和下载。
     *
     * @tags 库存报告
     * @name GenerateInventoryReport
     * @summary 生成在库报告
     * @request POST:/inventory/report/generate
     * @secure
     */
    generateInventoryReport: (data: InventoryReportReq, params: RequestParams = {}) =>
      this.request<InventoryReportResp, any>({
        path: `/inventory/report/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据报告ID获取在库报告的生成状态。 可用于轮询检查报告是否生成完成。
     *
     * @tags 库存报告
     * @name GetInventoryReportStatus
     * @summary 获取报告生成状态
     * @request GET:/inventory/reports/{reportId}/status
     * @secure
     */
    getInventoryReportStatus: (reportId: string, params: RequestParams = {}) =>
      this.request<InventoryReport, any>({
        path: `/inventory/reports/${reportId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的在库报告文件。 支持PDF和Excel格式的报告下载。
     *
     * @tags 库存报告
     * @name DownloadInventoryReport
     * @summary 下载在库报告
     * @request GET:/inventory/reports/{reportId}/download
     * @secure
     */
    downloadInventoryReport: (reportId: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/inventory/reports/${reportId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 获取入库报告的历史列表，支持按仓库、客户等条件筛选。
     *
     * @tags 入库报告
     * @name ListInboundReports
     * @summary 获取入库报告列表
     * @request GET:/inventory/inboundReports
     * @secure
     */
    listInboundReports: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库ID筛选 */
        warehouseId?: number;
        /** 客户ID筛选 */
        customerId?: number;
        /** 报告状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（报告生成时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（报告生成时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<InboundReportListResp, void>({
        path: `/inventory/inboundReports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定入库记录的入库报告PDF/Excel。 报告将异步生成，返回报告ID用于查询生成状态和下载。
     *
     * @tags 入库报告
     * @name GenerateInboundReport
     * @summary 生成入库报告
     * @request POST:/inventory/inboundReport/generate
     * @secure
     */
    generateInboundReport: (data: InboundReportReq, params: RequestParams = {}) =>
      this.request<InboundReportResp, void>({
        path: `/inventory/inboundReport/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据报告ID获取入库报告的生成状态。 可用于轮询检查报告是否生成完成。
     *
     * @tags 入库报告
     * @name GetInboundReportStatus
     * @summary 获取入库报告生成状态
     * @request GET:/inventory/inboundReports/{reportId}/status
     * @secure
     */
    getInboundReportStatus: (reportId: string, params: RequestParams = {}) =>
      this.request<InboundReport, void>({
        path: `/inventory/inboundReports/${reportId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的入库报告文件。 支持PDF和Excel格式的报告下载。
     *
     * @tags 入库报告
     * @name DownloadInboundReport
     * @summary 下载入库报告
     * @request GET:/inventory/inboundReports/{reportId}/download
     * @secure
     */
    downloadInboundReport: (reportId: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/inventory/inboundReports/${reportId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 获取出库报告的历史列表，支持按仓库、客户等条件筛选。
     *
     * @tags 出库报告
     * @name ListOutboundReports
     * @summary 获取出库报告列表
     * @request GET:/inventory/outboundReports
     * @secure
     */
    listOutboundReports: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库ID筛选 */
        warehouseId?: number;
        /** 客户ID筛选 */
        customerId?: number;
        /** 报告状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（报告生成时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（报告生成时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OutboundReportListResp, void>({
        path: `/inventory/outboundReports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定出库记录的出库报告PDF/Excel。 报告将异步生成，返回报告ID用于查询生成状态和下载。
     *
     * @tags 出库报告
     * @name GenerateOutboundReport
     * @summary 生成出库报告
     * @request POST:/inventory/outboundReport/generate
     * @secure
     */
    generateOutboundReport: (data: OutboundReportReq, params: RequestParams = {}) =>
      this.request<OutboundReportResp, void>({
        path: `/inventory/outboundReport/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据报告ID获取出库报告的生成状态。 可用于轮询检查报告是否生成完成。
     *
     * @tags 出库报告
     * @name GetOutboundReportStatus
     * @summary 获取出库报告生成状态
     * @request GET:/inventory/outboundReports/{reportId}/status
     * @secure
     */
    getOutboundReportStatus: (reportId: string, params: RequestParams = {}) =>
      this.request<OutboundReport, void>({
        path: `/inventory/outboundReports/${reportId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的出库报告文件。 支持PDF和Excel格式的报告下载。
     *
     * @tags 出库报告
     * @name DownloadOutboundReport
     * @summary 下载出库报告
     * @request GET:/inventory/outboundReports/{reportId}/download
     * @secure
     */
    downloadOutboundReport: (reportId: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/inventory/outboundReports/${reportId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListNameChanges
     * @summary 名义变更单列表
     * @request GET:/inventory/nameChanges
     * @secure
     */
    listNameChanges: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListNameChangesResp, any>({
        path: `/inventory/nameChanges`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CreateNameChange
     * @summary 创建名义变更单
     * @request POST:/inventory/nameChange
     * @secure
     */
    createNameChange: (data: NameChange, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name GetNameChange
     * @summary 名义变更单详情
     * @request GET:/inventory/nameChange/{id}
     * @secure
     */
    getNameChange: (id: number, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name UpdateNameChange
     * @summary 更新名义变更单
     * @request PUT:/inventory/nameChange/{id}
     * @secure
     */
    updateNameChange: (id: number, data: NameChange, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name DeleteNameChange
     * @summary 删除名义变更单
     * @request DELETE:/inventory/nameChange/{id}
     * @secure
     */
    deleteNameChange: (id: number, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/inventory/nameChange/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ApproveNameChange
     * @summary 确认名义变更单
     * @request POST:/inventory/nameChange/{id}/approve
     * @secure
     */
    approveNameChange: (id: number, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange/${id}/approve`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name RejectNameChange
     * @summary 拒绝名义变更单
     * @request POST:/inventory/nameChange/{id}/reject
     * @secure
     */
    rejectNameChange: (id: number, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange/${id}/reject`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name CancelNameChange
     * @summary 取消名义变更单
     * @request POST:/inventory/nameChange/{id}/cancel
     * @secure
     */
    cancelNameChange: (id: number, params: RequestParams = {}) =>
      this.request<NameChange, any>({
        path: `/inventory/nameChange/${id}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 库存
     * @name ListNameChangeItems
     * @summary 名义变更商品列表
     * @request GET:/inventory/nameChangeItems
     * @secure
     */
    listNameChangeItems: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 批次号 */
        lotNumber?: string;
        /** 商品ID */
        productId?: number;
        /**
         * 名义变更日期(From)
         * @format date
         */
        nameChangeDateFrom?: string;
        /**
         * 名义变更日期(To)
         * @format date
         */
        nameChangeDateTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListNameChangeItemsResp, any>({
        path: `/inventory/nameChangeItems`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取名义变更报告的历史列表，支持按仓库、客户等条件筛选。
     *
     * @tags 名义变更报告
     * @name ListNameChangeReports
     * @summary 获取名义变更报告列表
     * @request GET:/inventory/nameChangeReports
     * @secure
     */
    listNameChangeReports: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 仓库ID筛选 */
        warehouseId?: number;
        /** 客户ID筛选 */
        customerId?: number;
        /** 报告状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（报告生成时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（报告生成时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<NameChangeReportListResp, void>({
        path: `/inventory/nameChangeReports`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定名义变更记录的名义变更报告PDF/Excel。 报告将异步生成，返回报告ID用于查询生成状态和下载。
     *
     * @tags 名义变更报告
     * @name GenerateNameChangeReport
     * @summary 生成名义变更报告
     * @request POST:/inventory/nameChangeReport/generate
     * @secure
     */
    generateNameChangeReport: (data: NameChangeReportReq, params: RequestParams = {}) =>
      this.request<NameChangeReportResp, void>({
        path: `/inventory/nameChangeReport/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据报告ID获取名义变更报告的生成状态。 可用于轮询检查报告是否生成完成。
     *
     * @tags 名义变更报告
     * @name GetNameChangeReportStatus
     * @summary 获取名义变更报告生成状态
     * @request GET:/inventory/nameChangeReports/{reportId}/status
     * @secure
     */
    getNameChangeReportStatus: (reportId: string, params: RequestParams = {}) =>
      this.request<NameChangeReport, void>({
        path: `/inventory/nameChangeReports/${reportId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的名义变更报告文件。 支持PDF和Excel格式的报告下载。
     *
     * @tags 名义变更报告
     * @name DownloadNameChangeReport
     * @summary 下载名义变更报告
     * @request GET:/inventory/nameChangeReports/{reportId}/download
     * @secure
     */
    downloadNameChangeReport: (reportId: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/inventory/nameChangeReports/${reportId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  billing = {
    /**
     * No description
     *
     * @tags 结算
     * @name ListInvoices
     * @summary 发票列表
     * @request GET:/billing/invoices
     * @secure
     */
    listInvoices: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        pageSize?: number;
        /** 客户ID */
        customerId?: number;
        /** 发票状态 */
        status?: "draft" | "issued" | "cancelled" | "paid";
        /**
         * 出库日期（起）
         * @format date
         */
        outboundDateFrom?: string;
        /**
         * 出库日期（止）
         * @format date
         */
        outboundDateTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListInvoicesResp, any>({
        path: `/billing/invoices`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 结算
     * @name CreateInvoice
     * @summary 创建发票
     * @request POST:/billing/invoice
     * @secure
     */
    createInvoice: (data: CreateInvoiceReq, params: RequestParams = {}) =>
      this.request<Invoice, any>({
        path: `/billing/invoice`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 结算
     * @name GetInvoice
     * @summary 发票详情
     * @request GET:/billing/invoice/{id}
     * @secure
     */
    getInvoice: (id: number, params: RequestParams = {}) =>
      this.request<Invoice, any>({
        path: `/billing/invoice/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 结算
     * @name IssueInvoice
     * @summary 下发发票
     * @request POST:/billing/invoice/{id}/issue
     * @secure
     */
    issueInvoice: (id: number, data?: IssueInvoiceReq, params: RequestParams = {}) =>
      this.request<Invoice, any>({
        path: `/billing/invoice/${id}/issue`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 结算
     * @name CancelInvoice
     * @summary 取消发票
     * @request POST:/billing/invoice/{id}/cancel
     * @secure
     */
    cancelInvoice: (id: number, data?: CancelInvoiceReq, params: RequestParams = {}) =>
      this.request<Invoice, any>({
        path: `/billing/invoice/${id}/cancel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取发票打印版Excel生成任务的列表，支持按发票编号、客户和状态等条件筛选。
     *
     * @tags 结算
     * @name ListInvoicePrints
     * @summary 获取发票打印任务列表
     * @request GET:/billing/invoicePrints
     * @secure
     */
    listInvoicePrints: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 发票编号筛选 */
        invoiceNumber?: string;
        /** 客户ID筛选 */
        customerId?: number;
        /** 打印任务状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（任务创建时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（任务创建时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<InvoicePrintListResp, void>({
        path: `/billing/invoicePrints`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定发票的打印版Excel文件。 打印任务将异步执行，返回任务ID用于查询状态和下载。
     *
     * @tags 结算
     * @name GenerateInvoicePrint
     * @summary 生成发票打印版Excel
     * @request POST:/billing/invoicePrint/generate
     * @secure
     */
    generateInvoicePrint: (data: InvoicePrintReq, params: RequestParams = {}) =>
      this.request<InvoicePrintResp, void>({
        path: `/billing/invoicePrint/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据打印任务ID获取生成状态。 可用于轮询检查发票打印版是否生成完成。
     *
     * @tags 结算
     * @name GetInvoicePrintStatus
     * @summary 获取发票打印任务状态
     * @request GET:/billing/invoicePrints/{printId}/status
     * @secure
     */
    getInvoicePrintStatus: (printId: string, params: RequestParams = {}) =>
      this.request<InvoicePrint, void>({
        path: `/billing/invoicePrints/${printId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的发票打印版Excel文件。
     *
     * @tags 结算
     * @name DownloadInvoicePrint
     * @summary 下载发票打印版
     * @request GET:/billing/invoicePrints/{printId}/download
     * @secure
     */
    downloadInvoicePrint: (printId: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/billing/invoicePrints/${printId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  procurement = {
    /**
     * @description 获取注文书列表，支持按订单编号、客户和状态等条件筛选。
     *
     * @tags 采购
     * @name ListOrders
     * @summary 获取注文列表
     * @request GET:/procurement/orders
     * @secure
     */
    listOrders: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 注文编号筛选 */
        orderNumber?: string;
        /** 客户ID筛选 */
        customerId?: number;
        /** 状态筛选 */
        status?: "draft" | "requested" | "sent" | "completed" | "cancelled";
        /**
         * 纳期开始筛选
         * @format date
         */
        deliveryDueStart?: string;
        /**
         * 纳期结束筛选
         * @format date
         */
        deliveryDueEnd?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListOrdersResp, void>({
        path: `/procurement/orders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name CreateOrder
     * @summary 创建注文书
     * @request POST:/procurement/order
     * @secure
     */
    createOrder: (data: CreateOrderReq, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name GetOrder
     * @summary 注文详情
     * @request GET:/procurement/order/{id}
     * @secure
     */
    getOrder: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name UpdateOrder
     * @summary 更新注文书
     * @request PUT:/procurement/order/{id}
     * @secure
     */
    updateOrder: (id: number, data: UpdateOrderReq, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name CancelOrder
     * @summary 取消注文书
     * @request DELETE:/procurement/order/{id}
     * @secure
     */
    cancelOrder: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name SubmitOrder
     * @summary 提交注文书
     * @request POST:/procurement/order/{id}/submit
     * @secure
     */
    submitOrder: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}/submit`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name SendOrder
     * @summary 下发注文书
     * @request POST:/procurement/order/{id}/send
     * @secure
     */
    sendOrder: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}/send`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name CompleteOrder
     * @summary 完成注文书
     * @request POST:/procurement/order/{id}/complete
     * @secure
     */
    completeOrder: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}/complete`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 采购
     * @name CancelOrderAction
     * @summary 取消注文书
     * @request POST:/procurement/order/{id}/cancel
     * @secure
     */
    cancelOrderAction: (id: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/procurement/order/${id}/cancel`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取注文打印版Excel生成任务的列表，支持按订单编号、客户和状态等条件筛选。
     *
     * @tags 采购
     * @name ListOrderPrints
     * @summary 获取注文打印任务列表
     * @request GET:/procurement/orderPrints
     * @secure
     */
    listOrderPrints: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @max 100
         * @default 20
         */
        itemsPerPage?: number;
        /** 注文编号筛选 */
        orderNumber?: string;
        /** 客户ID筛选 */
        customerId?: number;
        /** 打印任务状态筛选 */
        status?: "pending" | "processing" | "completed" | "failed";
        /**
         * 开始日期筛选（任务创建时间）
         * @format date
         */
        startDate?: string;
        /**
         * 结束日期筛选（任务创建时间）
         * @format date
         */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrderPrintListResp, void>({
        path: `/procurement/orderPrints`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 生成指定注文书的打印版Excel文件。 打印任务将异步执行，返回任务ID用于查询状态和下载。
     *
     * @tags 采购
     * @name GenerateOrderPrint
     * @summary 生成注文打印版Excel
     * @request POST:/procurement/orderPrint/generate
     * @secure
     */
    generateOrderPrint: (data: OrderPrintReq, params: RequestParams = {}) =>
      this.request<OrderPrintResp, void>({
        path: `/procurement/orderPrint/generate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据打印任务ID获取生成状态。 可用于轮询检查注文打印版是否生成完成。
     *
     * @tags 采购
     * @name GetOrderPrintStatus
     * @summary 获取注文打印任务状态
     * @request GET:/procurement/orderPrints/{printId}/status
     * @secure
     */
    getOrderPrintStatus: (printId: string, params: RequestParams = {}) =>
      this.request<OrderPrint, void>({
        path: `/procurement/orderPrints/${printId}/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 下载已生成的注文打印版Excel文件。
     *
     * @tags 采购
     * @name DownloadOrderPrint
     * @summary 下载注文打印版
     * @request GET:/procurement/orderPrints/{printId}/download
     * @secure
     */
    downloadOrderPrint: (printId: string, params: RequestParams = {}) =>
      this.request<File, void>({
        path: `/procurement/orderPrints/${printId}/download`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  containers = {
    /**
     * No description
     *
     * @tags 集装箱
     * @name ListContainers
     * @summary 获取集装箱列表
     * @request GET:/containers
     * @secure
     */
    listContainers: (
      query?: {
        /**
         * 页码
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @default 20
         */
        itemsPerPage?: number;
        /** 集装箱号 */
        containerNumber?: string;
        /** 集装箱状态 */
        "statuses[]"?: (
          | "shipping"
          | "arrived"
          | "customsClearance"
          | "discharging"
          | "discharged"
          | "empty"
          | "returned"
          | "canceled"
          )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<ListContainersResp, any>({
        path: `/containers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  container = {
    /**
     * No description
     *
     * @tags 集装箱
     * @name CreateContainer
     * @summary 创建集装箱
     * @request POST:/container
     * @secure
     */
    createContainer: (data: CreateContainerReq, params: RequestParams = {}) =>
      this.request<CreateContainerResp, any>({
        path: `/container`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 集装箱
     * @name GetContainer
     * @summary 获取集装箱详情
     * @request GET:/container/{id}
     * @secure
     */
    getContainer: (id: number, params: RequestParams = {}) =>
      this.request<GetContainerResp, any>({
        path: `/container/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 集装箱
     * @name UpdateContainer
     * @summary 更新集装箱
     * @request PUT:/container/{id}
     * @secure
     */
    updateContainer: (id: number, data: Container, params: RequestParams = {}) =>
      this.request<GetContainerResp, any>({
        path: `/container/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 集装箱
     * @name DeleteContainer
     * @summary 删除集装箱
     * @request DELETE:/container/{id}
     * @secure
     */
    deleteContainer: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/container/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
