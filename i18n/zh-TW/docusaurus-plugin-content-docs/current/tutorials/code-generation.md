---
sidebar_position: 2
---

# Code Generation & Technical Documentation

Master the art of generating clean, functional code and comprehensive technical documentation through strategic prompting techniques.

## Code Generation Fundamentals

### Basic Code Generation Template

```python
"""
You are a [LANGUAGE] developer with [EXPERTISE_LEVEL] experience.

Create a [FUNCTION/CLASS/MODULE] that:
- [FUNCTIONALITY_1]
- [FUNCTIONALITY_2] 
- [FUNCTIONALITY_3]

Requirements:
- [TECHNICAL_REQUIREMENT_1]
- [TECHNICAL_REQUIREMENT_2]
- [PERFORMANCE_REQUIREMENT]

Include:
- Type hints/annotations where applicable
- Comprehensive error handling
- Clear docstrings and comments
- Unit test examples
"""
```

### Advanced Code Architecture Prompt

```python
"""
You are a senior software architect specializing in [TECHNOLOGY_STACK].

Design and implement [PROJECT_DESCRIPTION]:

Architecture Requirements:
- Scalability: [EXPECTED_LOAD/USERS]
- Performance: [RESPONSE_TIME_REQUIREMENTS]
- Reliability: [UPTIME_EXPECTATIONS]
- Security: [SECURITY_STANDARDS]

Implementation Specifications:
1. Data Layer
   - Database design and relationships
   - Data access patterns
   - Caching strategy

2. Business Logic Layer  
   - Core domain models
   - Service interfaces
   - Validation rules

3. Presentation Layer
   - API design (if applicable)
   - User interface components
   - Error handling and messaging

Deliverables:
- System architecture diagram
- Core implementation files
- Configuration examples
- Deployment instructions
- Testing strategy

Technology Constraints: [SPECIFIC_TECH_STACK]
Timeline: [PROJECT_TIMELINE]
Team Size: [DEVELOPMENT_TEAM_SIZE]
"""
```

## Language-Specific Examples

### Python Development

**Data Processing Pipeline:**
```python
"""
You are a Python data engineer with expertise in pandas, NumPy, and data pipeline design.

Create a robust data processing pipeline that:
- Reads CSV files from multiple sources
- Validates data quality and handles missing values
- Performs data transformations and aggregations
- Exports results to both CSV and JSON formats
- Includes comprehensive logging and error handling

Requirements:
- Use type hints throughout
- Implement configuration via environment variables
- Add progress tracking for large datasets
- Include memory-efficient processing for 1M+ records
- Follow PEP 8 style guidelines

Structure:
1. DataValidator class for quality checks
2. DataProcessor class for transformations  
3. DataExporter class for output handling
4. Main pipeline orchestration function
5. Configuration management module

Include unit tests using pytest and example usage documentation.
"""
```

**API Development:**
```python
"""
You are a Python backend developer specializing in FastAPI and modern web development.

Create a RESTful API for [APPLICATION_DOMAIN] with these endpoints:

Core Functionality:
- User authentication and authorization (JWT)
- CRUD operations for [MAIN_ENTITY]
- Data validation and serialization
- Database integration with SQLAlchemy
- Background task processing with Celery

API Endpoints:
POST /auth/login - User authentication
GET /auth/me - Current user profile
GET /[entities] - List entities with pagination/filtering
POST /[entities] - Create new entity
GET /[entities]/{id} - Retrieve specific entity
PUT /[entities]/{id} - Update entity
DELETE /[entities]/{id} - Delete entity

Requirements:
- Pydantic models for request/response validation
- Comprehensive error handling and HTTP status codes
- OpenAPI documentation with examples
- Rate limiting and security headers
- Database migrations with Alembic
- Environment-based configuration
- Comprehensive test suite

Include Docker configuration and deployment instructions.
"""
```

### JavaScript/Node.js Development

**React Component Library:**
```javascript
"""
You are a senior React developer with expertise in component design and TypeScript.

Create a reusable component library for [UI_COMPONENT_TYPE]:

Component Requirements:
- TypeScript interfaces for all props
- Comprehensive prop validation
- Accessibility (WCAG 2.1 AA compliance)
- Responsive design support
- Theme customization capability
- Performance optimization (memoization where appropriate)

Components to Create:
1. [Component1] - [Functionality]
2. [Component2] - [Functionality]
3. [Component3] - [Functionality]

For each component provide:
- TypeScript interface definitions
- Component implementation with hooks
- Storybook stories with multiple variants
- Unit tests with React Testing Library
- Usage documentation with examples

Additional Requirements:
- Styled-components or CSS modules for styling
- Custom hooks for shared logic
- Error boundaries where appropriate
- Performance monitoring integration points

Include build configuration and npm publishing setup.
"""
```

### Database Design & SQL

**Database Schema Design:**
```sql
"""
You are a database architect with expertise in PostgreSQL and relational database design.

Design a database schema for [APPLICATION_TYPE]:

Schema Requirements:
- Normalized design (3NF minimum)
- Proper indexing strategy
- Foreign key relationships with cascading rules
- Data validation constraints
- Audit trails for sensitive tables

Core Entities:
- [Entity1]: [Description and key attributes]
- [Entity2]: [Description and key attributes]
- [Entity3]: [Description and key attributes]

Deliverables:
1. Complete DDL scripts with table creation
2. Index creation statements with rationale
3. Sample data insertion scripts
4. Common query examples with performance notes
5. Migration scripts for schema updates
6. Backup and restore procedures

Performance Considerations:
- Expected data volume: [SIZE_ESTIMATES]
- Query patterns: [READ_VS_WRITE_RATIO]
- Scalability requirements: [GROWTH_PROJECTIONS]

Include documentation for developers and DBAs.
"""
```

## API Documentation Generation

### OpenAPI/Swagger Documentation

```python
"""
Create comprehensive OpenAPI 3.0 specification for [API_NAME]:

API Overview:
- Base URL: [BASE_URL]
- Authentication: [AUTH_METHOD]
- Version: [API_VERSION]
- Primary use cases: [USE_CASES]

For each endpoint include:
1. Complete path and HTTP method
2. Detailed description and purpose
3. Request parameters (path, query, body)
4. Request/response schema definitions
5. Example requests and responses
6. Error response formats and codes
7. Authentication requirements

Schema Definitions:
- User model with validation rules
- [Entity] models with relationships
- Error response structures
- Pagination metadata

Documentation Features:
- Interactive examples in multiple languages
- Authentication flow explanation
- Rate limiting details
- Webhook specifications (if applicable)
- SDK generation instructions

Include:
- Postman collection export
- cURL examples for each endpoint
- Client library usage examples
- Common integration patterns
"""
```

### Technical Documentation Templates

**README Generation:**
```markdown
"""
Create a comprehensive README.md for [PROJECT_NAME]:

Project Overview:
- Brief description and purpose
- Key features and capabilities
- Target audience and use cases
- Technology stack and dependencies

Structure Requirements:
# Project Name
[Compelling tagline]

## Overview
[2-3 paragraph project description]

## Features
- [Key feature 1 with brief explanation]
- [Key feature 2 with brief explanation]
- [Key feature 3 with brief explanation]

## Quick Start
[Minimal setup to get running]

## Installation
[Detailed setup instructions]

## Usage
[Code examples and common scenarios]

## API Reference
[Link to detailed API docs]

## Contributing
[Contribution guidelines and process]

## License
[License information]

Additional Sections:
- Prerequisites and system requirements
- Configuration options
- Troubleshooting common issues
- Changelog or versioning info
- Contact and support information

Make it scannable with proper headers, code blocks, and badges.
"""
```

## Testing & Quality Assurance

### Test Generation Prompts

**Unit Test Creation:**
```python
"""
You are a test engineer specializing in [TESTING_FRAMEWORK].

Create comprehensive unit tests for this [LANGUAGE] code:

[INSERT_CODE_TO_TEST]

Test Requirements:
- Test all public methods and functions
- Cover edge cases and error conditions
- Test boundary values and invalid inputs
- Mock external dependencies appropriately
- Achieve >90% code coverage

Test Categories:
1. Happy Path Tests
   - Normal operation scenarios
   - Expected input/output validation
   - Successful execution flows

2. Edge Case Tests
   - Boundary value testing
   - Empty/null input handling
   - Maximum/minimum value limits

3. Error Condition Tests
   - Exception handling verification
   - Invalid input responses
   - Resource unavailability scenarios

4. Integration Points
   - Database interaction mocking
   - External API call simulation
   - File system operation testing

Include:
- Setup and teardown methods
- Test data fixtures
- Performance benchmarks where relevant
- Documentation for complex test scenarios
"""
```

### Code Review Automation

```python
"""
You are a senior code reviewer with expertise in [LANGUAGE/FRAMEWORK].

Review this code for:

Code Quality Factors:
1. Readability and maintainability
2. Performance and efficiency
3. Security vulnerabilities
4. Best practice adherence
5. Documentation completeness

Code to Review:
[INSERT_CODE]

Provide feedback in this format:

## Overall Assessment
[High-level summary and rating 1-10]

## Strengths
- [Positive aspect 1]
- [Positive aspect 2]

## Issues Found

### Critical Issues (Fix Required)
- Line [X]: [Issue description and security/performance impact]
- Line [Y]: [Issue description and recommended fix]

### Suggestions (Recommended)
- Line [X]: [Improvement suggestion with rationale]
- Line [Y]: [Code style or maintainability suggestion]

### Questions/Clarifications
- [Question about design decision or implementation choice]

## Refactored Code Examples
[Provide improved versions for critical issues]

## Additional Recommendations
- Testing strategy improvements
- Documentation enhancements
- Performance optimization opportunities
"""
```

## DevOps & Deployment

### Infrastructure as Code

```yaml
"""
You are a DevOps engineer specializing in [CLOUD_PROVIDER] and infrastructure automation.

Create Infrastructure as Code for [APPLICATION_TYPE]:

Infrastructure Requirements:
- Environment: [DEVELOPMENT/STAGING/PRODUCTION]
- Expected traffic: [LOAD_ESTIMATES]
- High availability: [UPTIME_REQUIREMENTS]
- Security compliance: [COMPLIANCE_STANDARDS]

Components to Include:
1. Compute Resources
   - [SERVER_TYPE] instances with auto-scaling
   - Load balancer configuration
   - Health check endpoints

2. Database Layer
   - [DATABASE_TYPE] with backup strategy
   - Read replicas if needed
   - Connection pooling setup

3. Storage & CDN
   - Static asset storage
   - Media file handling
   - CDN configuration

4. Security & Monitoring
   - Security groups and network ACLs
   - SSL/TLS certificate management
   - Logging and monitoring setup
   - Alerting configuration

5. CI/CD Pipeline
   - Source code integration
   - Build and test automation
   - Deployment strategies (blue/green, rolling)
   - Rollback procedures

Deliverables:
- [TOOL] configuration files (Terraform/CloudFormation)
- Docker configuration and multi-stage builds
- Kubernetes manifests (if applicable)
- Environment variable management
- Deployment scripts and documentation
- Cost optimization recommendations
"""
```

## Code Generation Best Practices

### Quality Checklist

Before using generated code:
- [ ] **Security Review**: No hardcoded secrets, proper input validation
- [ ] **Performance**: Efficient algorithms, proper resource management
- [ ] **Error Handling**: Comprehensive exception handling and logging
- [ ] **Testing**: Unit tests cover main functionality and edge cases
- [ ] **Documentation**: Clear comments and usage examples
- [ ] **Standards**: Follows language-specific style guidelines

### Prompt Optimization Tips

1. **Be Specific About Requirements**: Include performance, security, and scalability needs
2. **Specify Output Format**: Request specific file structure, naming conventions
3. **Include Context**: Provide information about the larger system or application
4. **Request Tests**: Always ask for unit tests and usage examples
5. **Ask for Documentation**: Include inline comments and README sections

## Advanced Techniques

### Code Migration & Modernization

```python
"""
You are a software modernization expert with experience in [LEGACY_TECH] to [MODERN_TECH] migrations.

Modernize this legacy code:
[INSERT_LEGACY_CODE]

Migration Requirements:
- Convert from [OLD_LANGUAGE/FRAMEWORK] to [NEW_LANGUAGE/FRAMEWORK]
- Maintain existing functionality exactly
- Improve performance and maintainability
- Add modern features: [SPECIFIC_FEATURES]
- Update architecture patterns

Deliverables:
1. Modernized code with improved structure
2. Migration guide with step-by-step process
3. Comparison of old vs new functionality
4. Test plan to verify feature parity
5. Performance benchmarks
6. Deployment and rollback procedures

Consider:
- Data migration requirements
- API compatibility
- User impact and training needs
- Timeline and resource estimates
"""
```

## Next Steps

Ready to advance your technical prompting skills?
- **[Data Analysis](/docs/tutorials/data-analysis)** - Generate insights and reports from data
- **[Advanced Techniques](/docs/advanced/chain-of-thought)** - Complex reasoning and problem-solving
- **[Best Practices](/docs/best-practices/testing-prompts)** - Optimize prompt effectiveness

:::tip Development Workflow
Create a library of tested prompts for your most common development tasks. Version control your prompts alongside your code for consistent results across projects.
:::