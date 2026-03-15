
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** mcpforge-app
- **Date:** 2026-03-16
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Inline validation: email required when submitting empty form
- **Test Code:** [TC001_Inline_validation_email_required_when_submitting_empty_form.py](./TC001_Inline_validation_email_required_when_submitting_empty_form.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/c9feafca-0aaf-47ae-a219-2faff9563d00
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Inline validation: password strength requirements not met
- **Test Code:** [TC003_Inline_validation_password_strength_requirements_not_met.py](./TC003_Inline_validation_password_strength_requirements_not_met.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/3229fac0-7d06-467a-a04a-c6050eee0a38
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Inline validation: confirm password must match password
- **Test Code:** [TC004_Inline_validation_confirm_password_must_match_password.py](./TC004_Inline_validation_confirm_password_must_match_password.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/3aff4fea-e05c-4ec7-bd06-0181a30aa987
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Sign out successfully from Dashboard redirects to Sign in
- **Test Code:** [TC006_Sign_out_successfully_from_Dashboard_redirects_to_Sign_in.py](./TC006_Sign_out_successfully_from_Dashboard_redirects_to_Sign_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/041db0d3-3fe5-4e44-adb4-7062468f8e9c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Already authenticated user visiting /auth/signin is redirected to /dashboard
- **Test Code:** [TC009_Already_authenticated_user_visiting_authsignin_is_redirected_to_dashboard.py](./TC009_Already_authenticated_user_visiting_authsignin_is_redirected_to_dashboard.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Navigating to /auth/signin displayed the sign-in page instead of redirecting to /dashboard.
- Current URL is '/auth/signin' after navigation while an authenticated session existed.
- Email and Password input fields and the 'Sign In' button are visible on the page.
- Previously established authenticated session (dashboard was accessible) did not cause the application to redirect away from the sign-in page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/ce462b23-1381-422b-82f5-707addb74de6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Landing page loads and core marketing sections are visible
- **Test Code:** [TC011_Landing_page_loads_and_core_marketing_sections_are_visible.py](./TC011_Landing_page_loads_and_core_marketing_sections_are_visible.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/12566c6c-4331-4f40-8369-a4e8c330ace2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Get started CTA routes to Sign up
- **Test Code:** [TC012_Get_started_CTA_routes_to_Sign_up.py](./TC012_Get_started_CTA_routes_to_Sign_up.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/6e3d547a-9399-44a5-a46f-72fd4f1d6a71
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Header Sign in link routes to Sign in
- **Test Code:** [TC013_Header_Sign_in_link_routes_to_Sign_in.py](./TC013_Header_Sign_in_link_routes_to_Sign_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/bb786c52-2c38-4a2c-b841-1e83db00d10a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Open dashboard and view project cards list
- **Test Code:** [TC016_Open_dashboard_and_view_project_cards_list.py](./TC016_Open_dashboard_and_view_project_cards_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/d62af54f-a643-457d-a441-f13e08422a2a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Navigate from a project card to project detail page
- **Test Code:** [TC017_Navigate_from_a_project_card_to_project_detail_page.py](./TC017_Navigate_from_a_project_card_to_project_detail_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/51dcc80f-62d1-46d6-a6a2-40d8fa7883e4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Filter projects by name using dashboard search and clear search
- **Test Code:** [TC018_Filter_projects_by_name_using_dashboard_search_and_clear_search.py](./TC018_Filter_projects_by_name_using_dashboard_search_and_clear_search.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/8672cdcc-cc0b-475c-acc1-78d983082747
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Delete a project via card delete button and confirm deletion success
- **Test Code:** [TC020_Delete_a_project_via_card_delete_button_and_confirm_deletion_success.py](./TC020_Delete_a_project_via_card_delete_button_and_confirm_deletion_success.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/cd3f2571-034d-4c43-a010-16b33381fcef
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Start creating a new project from dashboard
- **Test Code:** [TC022_Start_creating_a_new_project_from_dashboard.py](./TC022_Start_creating_a_new_project_from_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/a364e9ae-b1f4-443b-814f-7486dfa551e2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Create project successfully by pasting valid OpenAPI JSON
- **Test Code:** [TC025_Create_project_successfully_by_pasting_valid_OpenAPI_JSON.py](./TC025_Create_project_successfully_by_pasting_valid_OpenAPI_JSON.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/bab6f9dd-7efd-49e8-8cee-6850273ca56c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Show invalid JSON syntax alert, then fix and create successfully
- **Test Code:** [TC026_Show_invalid_JSON_syntax_alert_then_fix_and_create_successfully.py](./TC026_Show_invalid_JSON_syntax_alert_then_fix_and_create_successfully.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/2337edf9-e835-436f-afa1-c3726d086b7b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Prevent create when paste content is empty
- **Test Code:** [TC027_Prevent_create_when_paste_content_is_empty.py](./TC027_Prevent_create_when_paste_content_is_empty.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/96c30006-a05d-456d-a7a3-22d8c552c3cd
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029 Show invalid YAML syntax error when pasting malformed YAML
- **Test Code:** [TC029_Show_invalid_YAML_syntax_error_when_pasting_malformed_YAML.py](./TC029_Show_invalid_YAML_syntax_error_when_pasting_malformed_YAML.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/ef4c3153-cafe-4fae-97d3-ad1c80587a2b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030 Reject non-OpenAPI JSON content
- **Test Code:** [TC030_Reject_non_OpenAPI_JSON_content.py](./TC030_Reject_non_OpenAPI_JSON_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/b4eb0885-ef97-4c5b-8259-2acee3be35a8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC032 Create project successfully by fetching a valid OpenAPI spec URL
- **Test Code:** [TC032_Create_project_successfully_by_fetching_a_valid_OpenAPI_spec_URL.py](./TC032_Create_project_successfully_by_fetching_a_valid_OpenAPI_spec_URL.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- 'Spec fetched successfully' message not found on the project creation page after attempting to fetch from the valid OpenAPI URL.
- The spec preview element is not visible on the page after fetch attempts.
- The page showed a persistent validation state ('No content provided' / 'Fetching...') or prior 'Failed to fetch: 404' during attempts, preventing visible spec preview.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/352eafcc-295b-4a28-9b76-6ee0ede0c904
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC033 Invalid URL format shows validation error and allows correction
- **Test Code:** [TC033_Invalid_URL_format_shows_validation_error_and_allows_correction.py](./TC033_Invalid_URL_format_shows_validation_error_and_allows_correction.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/75c72be0-c0c7-4160-8ec7-3989eebdfd5a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC034 Remote 404 fetch shows failure message and user can retry with another URL
- **Test Code:** [TC034_Remote_404_fetch_shows_failure_message_and_user_can_retry_with_another_URL.py](./TC034_Remote_404_fetch_shows_failure_message_and_user_can_retry_with_another_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/d0ca83ec-1bb7-4858-9b02-ca46eb61cc57
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC036 Create Project is blocked until a spec is successfully fetched and previewed
- **Test Code:** [TC036_Create_Project_is_blocked_until_a_spec_is_successfully_fetched_and_previewed.py](./TC036_Create_Project_is_blocked_until_a_spec_is_successfully_fetched_and_previewed.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/2cb692e5-d935-4e2e-8ee0-1bdd42ed2f2a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC039 Project detail page renders core layout for an owned project
- **Test Code:** [TC039_Project_detail_page_renders_core_layout_for_an_owned_project.py](./TC039_Project_detail_page_renders_core_layout_for_an_owned_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/c5008cd5-e1b0-4304-a49a-1332d0bf8c38
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC040 Project detail page shows two-column layout with endpoints table and server config panel
- **Test Code:** [TC040_Project_detail_page_shows_two_column_layout_with_endpoints_table_and_server_config_panel.py](./TC040_Project_detail_page_shows_two_column_layout_with_endpoints_table_and_server_config_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/51832591-f8d3-42dd-8dea-786225db38f4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC042 Navigate back to dashboard from project detail using back arrow
- **Test Code:** [TC042_Navigate_back_to_dashboard_from_project_detail_using_back_arrow.py](./TC042_Navigate_back_to_dashboard_from_project_detail_using_back_arrow.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/4db25edf-ab8e-450e-a3e4-df9770213afa
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC045 Project detail shows endpoint table columns and summary bar counts
- **Test Code:** [TC045_Project_detail_shows_endpoint_table_columns_and_summary_bar_counts.py](./TC045_Project_detail_shows_endpoint_table_columns_and_summary_bar_counts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/bc74ea4c-7b0f-475f-a7f1-490382e7505a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC046 Endpoint table shows method badge and path values for at least one row
- **Test Code:** [TC046_Endpoint_table_shows_method_badge_and_path_values_for_at_least_one_row.py](./TC046_Endpoint_table_shows_method_badge_and_path_values_for_at_least_one_row.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/60a81f2b-36fd-4db6-b3cc-0d0416455e41
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC049 Empty state appears when filters yield no endpoints
- **Test Code:** [TC049_Empty_state_appears_when_filters_yield_no_endpoints.py](./TC049_Empty_state_appears_when_filters_yield_no_endpoints.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/36b7273f-857a-4fae-be44-6a1d736038f7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC050 Search by path substring filters endpoint table and clearing restores results
- **Test Code:** [TC050_Search_by_path_substring_filters_endpoint_table_and_clearing_restores_results.py](./TC050_Search_by_path_substring_filters_endpoint_table_and_clearing_restores_results.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Endpoints list is empty on the project page: '0 endpoints total' is displayed, so there are no rows to filter.
- Filtering behavior cannot be validated because no endpoint rows exist to match a path substring.
- Clearing the search cannot be validated because there is no full list to restore after clearing.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/7a04ba4f-9f00-4683-be5c-db83c9c9b47a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC051 Search by operationId filters endpoint table and clearing restores results
- **Test Code:** [TC051_Search_by_operationId_filters_endpoint_table_and_clearing_restores_results.py](./TC051_Search_by_operationId_filters_endpoint_table_and_clearing_restores_results.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e29cd223-d5e0-440b-afa4-5436f7cb6ca5/82f9d23c-3cf2-4c65-bcdb-cc0428b8b255
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **90.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---