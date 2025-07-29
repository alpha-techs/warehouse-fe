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
}

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
  /** 创建时间 */
  createdAt?: string;
}

export type ListOutboundsResp = Pagination & {
  items?: Outbound[];
};

export interface OutboundItem {
  /** 出库物品ID */
  id?: number;
  /** 出库记录ID */
  outboundId?: number;
  /** 入库物品ID */
  inboundItemId?: number;
  /** 库存物品ID */
  inventoryItemId?: number;
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
  /** 备注 */
  note?: string;
}

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
      this.request<GetCustomerResp, any>({
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
