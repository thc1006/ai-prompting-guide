---
sidebar_position: 2
---

# 生產環境部署

學習在生產環境中部署 AI 提示解決方案，掌握企業應用的可靠性、可擴展性和可維護性最佳實踐。

## 生產就緒框架

### 系統架構考量

```python
"""
生產環境架構設計：

核心組件：
1. 提示管理系統
   - 版本控制與回滾功能
   - A/B 測試基礎設施
   - 模板庫與繼承機制
   - 配置管理

2. 執行引擎
   - 負載平衡與故障轉移
   - 速率限制與流量控制
   - 快取與優化
   - 錯誤處理與恢復

3. 監控與分析
   - 即時效能指標
   - 品質監控與警報
   - 使用分析與優化
   - 成本追蹤與預算控制

4. 整合層
   - API 設計與文件
   - 身份驗證與授權
   - 資料管道整合
   - 第三方服務連接
"""
```

### 可擴展性規劃

```python
"""
可擴展性架構：

水平擴展策略：
- 跨多個 AI 服務端點的負載分配
- 高流量請求的佇列處理
- 快取常用提示回應
- 提示中繼資料與結果的資料庫分片

效能優化：
- 提示模板預處理與編譯
- 智慧失效的回應快取
- 連接池與資源管理
- 非即時任務的非同步處理

容量規劃：
- 流量模式分析與預測
- 資源使用監控與警報
- 自動擴展政策與閾值
- 成本優化策略

擴展配置範例：
```yaml
scaling_policy:
  metrics:
    - requests_per_minute > 1000: scale_up
    - cpu_utilization > 80%: scale_up
    - queue_length > 50: scale_up
    - response_time > 5s: scale_up
  
  actions:
    scale_up: increase_instances(factor=1.5)
    scale_down: decrease_instances(factor=0.7)
    
  limits:
    min_instances: 2
    max_instances: 20
    cooldown_period: 300s
```
"""
```

## 部署策略

### 藍綠部署

```python
"""
提示藍綠部署：

策略概述：
- 藍色環境：當前生產環境提示
- 綠色環境：新版本提示
- 即時切換能力
- 零停機時間部署

實施流程：
1. 將新提示部署到綠色環境
2. 執行自動化測試與驗證
3. 逐步將流量導向綠色環境
4. 監控效能與品質指標
5. 完成切換或回滾（如有問題）

部署配置：
```yaml
deployment:
  strategy: blue_green
  environments:
    blue:
      weight: 100
      version: "v1.2.3"
      health_check: "/health"
    green:
      weight: 0
      version: "v1.2.4"
      health_check: "/health"
  
  switchover:
    criteria:
      - error_rate < 0.1%
      - response_time < 2s
      - quality_score > 0.85
    
  rollback:
    triggers:
      - error_rate > 1%
      - quality_degradation > 10%
      - manual_intervention: true
```

優勢：
- 即時回滾能力
- 在生產環境中無風險測試
- 部署期間零停機時間
- 環境清楚分離
"""
```

### 金絲雀部署

```python
"""
金絲雀部署策略：

漸進推出流程：
1. 將新提示版本部署到小子集（5% 流量）
2. 監控關鍵指標與品質指標
3. 如指標良好則逐步增加流量
4. 建立信心後完全推出

流量路由配置：
```python
canary_config = {
    "rollout_stages": [
        {"traffic_percent": 5, "duration": "2h", "success_criteria": {"error_rate": "<0.5%"}},
        {"traffic_percent": 25, "duration": "4h", "success_criteria": {"quality_score": ">0.8"}},
        {"traffic_percent": 50, "duration": "8h", "success_criteria": {"response_time": "<3s"}},
        {"traffic_percent": 100, "duration": "ongoing", "success_criteria": {"all_metrics_good": True}}
    ],
    "rollback_triggers": {
        "error_rate": ">2%",
        "quality_degradation": ">15%", 
        "response_time": ">10s",
        "user_complaints": ">threshold"
    },
    "monitoring_interval": "5m"
}
```

品質關卡：
- 各階段自動化品質評估
- 使用者滿意度回饋監控
- 效能指標比較
- 商業指標影響分析
"""
```

## 配置管理

### 環境特定配置

```python
"""
環境配置管理：

開發環境：
```yaml
environment: development
prompt_config:
  model_settings:
    temperature: 0.7
    max_tokens: 2000
    timeout: 30s
  
  quality_thresholds:
    min_quality_score: 0.6
    max_error_rate: 5%
  
  debugging:
    verbose_logging: true
    trace_enabled: true
    performance_profiling: true
```

測試環境：
```yaml
environment: staging
prompt_config:
  model_settings:
    temperature: 0.3
    max_tokens: 1500
    timeout: 15s
  
  quality_thresholds:
    min_quality_score: 0.8
    max_error_rate: 1%
  
  testing:
    automated_qa: true
    load_testing: true
    integration_tests: true
```

生產環境：
```yaml
environment: production
prompt_config:
  model_settings:
    temperature: 0.1
    max_tokens: 1000
    timeout: 10s
  
  quality_thresholds:
    min_quality_score: 0.9
    max_error_rate: 0.1%
  
  monitoring:
    real_time_alerts: true
    performance_tracking: true
    business_metrics: true
```
"""
```

### 提示版本控制

```python
"""
提示版本控制系統：

版本管理結構：
```
prompts/
├── templates/
│   ├── content_generation/
│   │   ├── blog_post_v1.2.3.yaml
│   │   ├── social_media_v2.1.0.yaml
│   │   └── email_campaign_v1.5.2.yaml
│   └── analysis/
│       ├── data_analysis_v3.0.1.yaml
│       └── competitive_intel_v1.8.0.yaml
├── configurations/
│   ├── development.yaml
│   ├── staging.yaml
│   └── production.yaml
└── schemas/
    ├── prompt_schema.json
    └── response_schema.json
```

版本中繼資料：
```yaml
prompt_metadata:
  version: "2.1.3"
  created_date: "2024-03-15T10:30:00Z"
  author: "ai-team@company.com"
  description: "增強部落格文章產生，包含 SEO 優化"
  
  changes:
    - "新增結構化輸出格式"
    - "改善關鍵字整合"
    - "增強可讀性評分"
  
  testing:
    test_coverage: 95%
    quality_score: 0.92
    performance_benchmark: "平均回應時間 1.8 秒"
  
  deployment:
    environments: ["staging", "production"]
    rollback_version: "2.1.2"
    approval_required: true
```

部署管道：
1. 開發者提交提示變更
2. 自動化測試與驗證
3. 程式碼檢視與核准流程
4. 測試環境部署
5. 生產就緒檢查清單
6. 漸進式生產推出
7. 效能監控與驗證
"""
```

## 監控與可觀測性

### 即時監控儀表板

```python
"""
生產監控框架：

關鍵效能指標：
1. 品質指標
   - 回應品質分數（即時）
   - 格式合規率
   - 內容相關性測量
   - 使用者滿意度評分

2. 效能指標
   - 平均回應時間
   - 第 95 百分位延遲
   - 吞吐量（每秒請求數）
   - 錯誤率與失敗模式

3. 商業指標
   - 每請求成本
   - 使用者參與度改善
   - 轉換率影響
   - 收益歸因

4. 系統健康
   - 服務可用性
   - 資源使用率
   - 佇列深度與處理時間
   - 依賴項健康狀態

警報配置：
```yaml
alerts:
  quality_degradation:
    condition: quality_score < 0.8
    severity: high
    notification: ["team-lead", "on-call"]
    
  performance_issue:
    condition: response_time > 10s
    severity: critical
    notification: ["ops-team", "engineering"]
    
  cost_anomaly:
    condition: cost_increase > 50%
    severity: medium
    notification: ["finance", "product-manager"]
    
  error_spike:
    condition: error_rate > 2%
    severity: critical
    notification: ["engineering", "on-call"]
```
"""
```

### 日誌記錄與除錯

```python
"""
全面日誌記錄策略：

日誌層級與內容：
```python
import logging
import json
from datetime import datetime

class PromptLogger:
    def __init__(self, service_name):
        self.service_name = service_name
        self.logger = logging.getLogger(service_name)
    
    def log_request(self, request_id, prompt_template, input_data, user_context):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "service": self.service_name,
            "request_id": request_id,
            "event_type": "prompt_request",
            "prompt_version": prompt_template.version,
            "input_size": len(str(input_data)),
            "user_context": user_context,
            "trace_id": request_id
        }
        self.logger.info(json.dumps(log_entry))
    
    def log_response(self, request_id, response_data, quality_metrics, performance_metrics):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "service": self.service_name,
            "request_id": request_id,
            "event_type": "prompt_response",
            "response_size": len(str(response_data)),
            "quality_score": quality_metrics.get("quality_score"),
            "response_time": performance_metrics.get("response_time"),
            "token_usage": performance_metrics.get("token_count"),
            "success": quality_metrics.get("success", True)
        }
        self.logger.info(json.dumps(log_entry))
    
    def log_error(self, request_id, error_type, error_message, context):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "service": self.service_name,
            "request_id": request_id,
            "event_type": "error",
            "error_type": error_type,
            "error_message": error_message,
            "context": context,
            "severity": "error"
        }
        self.logger.error(json.dumps(log_entry))
```

結構化日誌記錄優勢：
- 易於解析與分析
- 跨分散式系統關聯
- 效能優化洞察
- 除錯與故障排除支援
"""
```

## 錯誤處理與韌性

### 容錯模式

```python
"""
AI 系統韌性模式：

1. 斷路器模式：
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenException()
        
        try:
            result = func(*args, **kwargs)
            self.reset()
            return result
        except Exception as e:
            self.record_failure()
            raise
    
    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
    
    def reset(self):
        self.failure_count = 0
        self.state = 'CLOSED'
```

2. 指數退避重試：
```python
class RetryManager:
    def __init__(self, max_attempts=3, base_delay=1, max_delay=60):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
    
    def execute_with_retry(self, func, *args, **kwargs):
        for attempt in range(self.max_attempts):
            try:
                return func(*args, **kwargs)
            except RetryableException as e:
                if attempt == self.max_attempts - 1:
                    raise
                
                delay = min(self.base_delay * (2 ** attempt), self.max_delay)
                time.sleep(delay + random.uniform(0, 1))  # 抖動
        
        raise MaxRetriesExceededException()
```

3. 優雅降級：
```python
class GracefulDegradation:
    def __init__(self):
        self.fallback_responses = {
            "content_generation": "目前無法產生內容，請稍後再試。",
            "data_analysis": "分析服務暫時無法使用，請稍後查看。",
            "code_generation": "程式碼產生功能目前離線，需要手動實作。"
        }
    
    def handle_service_failure(self, service_type, original_request):
        # 記錄失敗
        logger.warning(f"服務 {service_type} 失敗，使用備用方案")
        
        # 回傳適當的備用回應
        if service_type in self.fallback_responses:
            return self.fallback_responses[service_type]
        
        # 通用備用方案
        return "服務暫時無法使用，請稍後再試。"
```
"""
```

### 資料備份與恢復

```python
"""
備份與恢復策略：

備份組件：
1. 提示模板與版本
2. 配置檔案
3. 訓練資料與範例
4. 效能指標與分析
5. 使用者回饋與評分

備份排程：
```yaml
backup_strategy:
  incremental:
    frequency: hourly
    retention: 7_days
    
  full:
    frequency: daily
    retention: 30_days
    
  archive:
    frequency: monthly
    retention: 1_year
    
  disaster_recovery:
    cross_region_replication: true
    rpo: 1_hour  # 恢復點目標
    rto: 4_hours # 恢復時間目標
```

恢復程序：
```python
class DisasterRecovery:
    def __init__(self, backup_manager, config_manager):
        self.backup_manager = backup_manager
        self.config_manager = config_manager
    
    def restore_service(self, recovery_point):
        """將服務恢復到特定時間點"""
        try:
            # 1. 恢復提示模板
            self.backup_manager.restore_prompts(recovery_point)
            
            # 2. 恢復配置
            self.config_manager.restore_configs(recovery_point)
            
            # 3. 驗證恢復的組件
            validation_result = self.validate_restored_service()
            
            if validation_result.success:
                logger.info(f"服務成功恢復到 {recovery_point}")
                return True
            else:
                logger.error(f"服務恢復失敗：{validation_result.errors}")
                return False
                
        except Exception as e:
            logger.error(f"災難恢復失敗：{str(e)}")
            return False
    
    def validate_restored_service(self):
        """對恢復的服務執行健康檢查"""
        # 驗證邏輯實作
        pass
```
"""
```

## 安全性與合規

### 安全最佳實踐

```python
"""
生產安全框架（符合台灣法規要求）：

1. 輸入驗證與淨化（符合台灣個資法）：
```python
class InputValidator:
    def __init__(self):
        self.max_input_length = 10000
        self.allowed_formats = ['text', 'json', 'yaml']
        self.forbidden_patterns = [
            r'<script.*?>.*?</script>',  # 防止 XSS
            r'javascript:',               # JavaScript 注入
            r'data:text/html',           # Data URI XSS
        ]
        # 台灣個資法敏感資料模式
        self.taiwan_pii_patterns = [
            r'\d{10}',                   # 身分證號
            r'09\d{8}',                  # 手機號碼
            r'\d{4}-\d{4}-\d{4}-\d{4}',  # 信用卡號
        ]
    
    def validate_input(self, user_input, input_format='text'):
        # 長度驗證
        if len(user_input) > self.max_input_length:
            raise InputValidationError("輸入過長")
        
        # 格式驗證
        if input_format not in self.allowed_formats:
            raise InputValidationError("格式無效")
        
        # 惡意模式驗證
        for pattern in self.forbidden_patterns:
            if re.search(pattern, user_input, re.IGNORECASE):
                raise SecurityViolationError("偵測到潛在惡意內容")
        
        # 台灣個資檢查
        for pattern in self.taiwan_pii_patterns:
            if re.search(pattern, user_input):
                raise PrivacyViolationError("偵測到個人資料，違反個資法")
        
        return True
```

2. 身份驗證與授權（符合 NCC 資安規範）：
```python
class SecurityManager:
    def __init__(self):
        self.token_manager = JWTTokenManager()
        self.rate_limiter = RateLimiter()
        self.taiwan_compliance = TaiwanComplianceManager()
        
    def authenticate_request(self, request):
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationError("缺少授權令牌")
        
        try:
            user_info = self.token_manager.validate_token(token)
            # 檢查台灣資安要求
            self.taiwan_compliance.validate_user_access(user_info)
            return user_info
        except TokenValidationError:
            raise AuthenticationError("無效令牌")
    
    def authorize_action(self, user_info, action, resource):
        permissions = user_info.get('permissions', [])
        required_permission = f"{action}:{resource}"
        
        if required_permission not in permissions:
            raise AuthorizationError("權限不足")
        
        # 記錄存取日誌（法規要求）
        self.taiwan_compliance.log_access_attempt(user_info, action, resource)
        
        return True
    
    def apply_rate_limiting(self, user_id, endpoint):
        if not self.rate_limiter.allow_request(user_id, endpoint):
            raise RateLimitExceededError("請求過於頻繁")
```

3. 資料隱私與保護（台灣個資法合規）：
```python
class DataProtectionManager:
    def __init__(self):
        self.encryption_key = self.load_encryption_key()
        self.taiwan_pii_detector = TaiwanPIIDetector()
    
    def sanitize_logs(self, log_data):
        """移除日誌中的個資（符合個資法）"""
        sanitized_data = log_data.copy()
        
        # 偵測並遮罩台灣個資
        pii_fields = self.taiwan_pii_detector.find_taiwan_pii(log_data)
        for field in pii_fields:
            sanitized_data[field] = self.mask_sensitive_data(sanitized_data[field])
        
        return sanitized_data
    
    def encrypt_sensitive_data(self, data):
        """加密敏感資料（符合政府資安規範）"""
        return self.encryption_manager.encrypt_taiwan_compliant(data, self.encryption_key)
    
    def ensure_data_residency(self, user_location, data):
        """確保資料符合地理邊界要求（台灣資料在地化）"""
        if user_location == 'taiwan':
            current_region = self.get_current_region()
            if current_region not in ['taiwan', 'asia-pacific']:
                raise DataResidencyViolationError("違反台灣資料在地化要求")
```
"""
```

## 成本優化

### 資源管理

```python
"""
成本優化策略（適用台灣雲端服務）：

1. Token 使用優化：
```python
class TokenOptimizer:
    def __init__(self):
        self.token_budget_per_request = 2000
        self.optimization_strategies = [
            self.compress_context,
            self.use_templates,
            self.cache_responses,
            self.batch_requests
        ]
    
    def optimize_prompt(self, original_prompt, context):
        optimized_prompt = original_prompt
        
        for strategy in self.optimization_strategies:
            optimized_prompt = strategy(optimized_prompt, context)
            
            if self.estimate_tokens(optimized_prompt) <= self.token_budget_per_request:
                break
        
        return optimized_prompt
    
    def compress_context(self, prompt, context):
        """移除內容中的冗餘資訊"""
        # 內容壓縮實作
        pass
    
    def use_templates(self, prompt, context):
        """使用模板取代重複文字"""
        # 模板替換實作
        pass
```

2. 快取策略（搭配台灣雲端服務）：
```python
class IntelligentCache:
    def __init__(self, redis_client, ttl_default=3600):
        self.redis = redis_client  # 可使用中華電信 HiCloud 或遠傳 Redis
        self.ttl_default = ttl_default
        self.cache_stats = CacheStatistics()
    
    def get_cached_response(self, prompt_hash, context_hash):
        cache_key = f"prompt:{prompt_hash}:context:{context_hash}"
        cached_response = self.redis.get(cache_key)
        
        if cached_response:
            self.cache_stats.record_hit()
            return json.loads(cached_response)
        
        self.cache_stats.record_miss()
        return None
    
    def cache_response(self, prompt_hash, context_hash, response, custom_ttl=None):
        cache_key = f"prompt:{prompt_hash}:context:{context_hash}"
        ttl = custom_ttl or self.calculate_dynamic_ttl(response)
        
        self.redis.setex(
            cache_key,
            ttl,
            json.dumps(response)
        )
    
    def calculate_dynamic_ttl(self, response):
        """根據回應特性計算 TTL"""
        base_ttl = self.ttl_default
        
        # 高品質穩定回應較長 TTL
        if response.get('quality_score', 0) > 0.9:
            base_ttl *= 2
        
        # 時敏內容較短 TTL
        if self.is_time_sensitive(response):
            base_ttl //= 2
        
        return base_ttl
```

3. 預算管理（台幣計價）：
```python
class BudgetManager:
    def __init__(self):
        self.daily_budget = 30000.0  # 新台幣
        self.hourly_budget = self.daily_budget / 24
        self.cost_per_token = 0.003  # 台幣計價
        self.current_spend = self.get_current_spend()
        self.taiwan_tax_rate = 0.05  # 營業稅
    
    def check_budget_availability(self, estimated_tokens):
        estimated_cost = estimated_tokens * self.cost_per_token * (1 + self.taiwan_tax_rate)
        
        if self.current_spend + estimated_cost > self.daily_budget:
            raise BudgetExceededException("將超過每日預算限制")
        
        return True
    
    def track_usage(self, actual_tokens, request_id):
        actual_cost = actual_tokens * self.cost_per_token * (1 + self.taiwan_tax_rate)
        self.current_spend += actual_cost
        
        # 記錄使用分析
        self.log_usage(request_id, actual_tokens, actual_cost)
        
        # 接近預算限制時警報
        if self.current_spend > self.daily_budget * 0.8:
            self.send_budget_alert("已達每日預算 80%")
```
"""
```

## 下一步

準備確保負責任且安全的 AI 部署？
- **[安全與倫理](/docs/best-practices/security-ethics)** - 實施安全與倫理準則
- **[團隊協作](/docs/best-practices/team-collaboration)** - 跨團隊擴展提示工程
- **[案例研究](/docs/case-studies/enterprise-deployment)** - 從實際實作中學習

:::tip 生產成功要訣
從非關鍵系統的試點部署開始。在擴展到關鍵業務應用之前，先建立監控和營運經驗。始終準備回滾計劃並定期測試。
:::