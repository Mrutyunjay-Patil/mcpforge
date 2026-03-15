
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
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/ff36b1ec-1266-4cf8-9477-ba17702f7c6f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Inline validation: password strength requirements not met
- **Test Code:** [TC003_Inline_validation_password_strength_requirements_not_met.py](./TC003_Inline_validation_password_strength_requirements_not_met.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/5a0691f7-24ab-48dd-84d8-b4461034ea6f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Inline validation: confirm password must match password
- **Test Code:** [TC004_Inline_validation_confirm_password_must_match_password.py](./TC004_Inline_validation_confirm_password_must_match_password.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/b9d5aee0-14dd-4c37-9499-fba9d4d6dca9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Sign out successfully from Dashboard redirects to Sign in
- **Test Code:** [TC006_Sign_out_successfully_from_Dashboard_redirects_to_Sign_in.py](./TC006_Sign_out_successfully_from_Dashboard_redirects_to_Sign_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/1b3ca7fb-f743-4870-9dde-e94430bee718
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Already authenticated user visiting /auth/signin is redirected to /dashboard
- **Test Code:** [TC009_Already_authenticated_user_visiting_authsignin_is_redirected_to_dashboard.py](./TC009_Already_authenticated_user_visiting_authsignin_is_redirected_to_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/27d82395-7e40-4290-aee9-678a40fc06c2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Landing page loads and core marketing sections are visible
- **Test Code:** [TC011_Landing_page_loads_and_core_marketing_sections_are_visible.py](./TC011_Landing_page_loads_and_core_marketing_sections_are_visible.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/2942bdae-0e09-4eeb-ac51-b79677fb4785
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Get started CTA routes to Sign up
- **Test Code:** [TC012_Get_started_CTA_routes_to_Sign_up.py](./TC012_Get_started_CTA_routes_to_Sign_up.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/ec5d1ae0-53ea-4aac-982e-982e81010dc4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Header Sign in link routes to Sign in
- **Test Code:** [TC013_Header_Sign_in_link_routes_to_Sign_in.py](./TC013_Header_Sign_in_link_routes_to_Sign_in.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/ed6ae321-eb9c-4094-b1dd-b4c255a7526c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Open dashboard and view project cards list
- **Test Code:** [TC016_Open_dashboard_and_view_project_cards_list.py](./TC016_Open_dashboard_and_view_project_cards_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/10d9299a-a326-4f57-82b8-44d425fd64e1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Navigate from a project card to project detail page
- **Test Code:** [TC017_Navigate_from_a_project_card_to_project_detail_page.py](./TC017_Navigate_from_a_project_card_to_project_detail_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/ad54c45f-97ff-4d44-ba1c-b4e83ae7e760
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Filter projects by name using dashboard search and clear search
- **Test Code:** [TC018_Filter_projects_by_name_using_dashboard_search_and_clear_search.py](./TC018_Filter_projects_by_name_using_dashboard_search_and_clear_search.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Search input did not filter project cards: entering 'a' resulted in the same 4 visible project cards (indices 72134, 72135, 72136, 72137) as before filtering.
- Clearing the search input did not change the visible project cards: the post-clear list matches the pre-clear list (indices 72134, 72135, 72136, 72137).
- Expected behavior (entering a search term should narrow the visible project cards to a subset) was not observed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/15acf47b-8552-4cc1-8165-c9792dcf0b42
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Delete a project via card delete button and confirm deletion success
- **Test Code:** [TC020_Delete_a_project_via_card_delete_button_and_confirm_deletion_success.py](./TC020_Delete_a_project_via_card_delete_button_and_confirm_deletion_success.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Delete button not found on project details page or on the dashboard project card, preventing deletion from being initiated.
- No confirmation AlertDialog appeared when inspecting project details or dashboard, so deletion cannot be confirmed.
- 'Project deleted' success toast cannot be observed because the delete action could not be performed.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/08b7d0b1-3365-46f1-97b0-bdfef312a35e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Start creating a new project from dashboard
- **Test Code:** [TC022_Start_creating_a_new_project_from_dashboard.py](./TC022_Start_creating_a_new_project_from_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/5da2febe-95f1-47e0-9b70-fea1407cca75
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Create project successfully by pasting valid OpenAPI JSON
- **Test Code:** [TC025_Create_project_successfully_by_pasting_valid_OpenAPI_JSON.py](./TC025_Create_project_successfully_by_pasting_valid_OpenAPI_JSON.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/e22eab4d-2343-43a6-89d8-be18a26fdc2a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Show invalid JSON syntax alert, then fix and create successfully
- **Test Code:** [TC026_Show_invalid_JSON_syntax_alert_then_fix_and_create_successfully.py](./TC026_Show_invalid_JSON_syntax_alert_then_fix_and_create_successfully.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/34843255-0e79-4fac-8839-509e60e7124d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Prevent create when paste content is empty
- **Test Code:** [TC027_Prevent_create_when_paste_content_is_empty.py](./TC027_Prevent_create_when_paste_content_is_empty.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/5f70c88c-e83f-4c89-8cd6-fbc9cefade48
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029 Show invalid YAML syntax error when pasting malformed YAML
- **Test Code:** [TC029_Show_invalid_YAML_syntax_error_when_pasting_malformed_YAML.py](./TC029_Show_invalid_YAML_syntax_error_when_pasting_malformed_YAML.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/ac8740f1-4908-4809-989a-c89020389914
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030 Reject non-OpenAPI JSON content
- **Test Code:** [TC030_Reject_non_OpenAPI_JSON_content.py](./TC030_Reject_non_OpenAPI_JSON_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/9c8e0e8c-4823-4264-9bc2-445499426aee
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC032 Create project successfully by fetching a valid OpenAPI spec URL
- **Test Code:** [TC032_Create_project_successfully_by_fetching_a_valid_OpenAPI_spec_URL.py](./TC032_Create_project_successfully_by_fetching_a_valid_OpenAPI_spec_URL.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Failed to fetch: 404 message displayed after attempting to fetch the OpenAPI URL.
- No content provided validation message is displayed, indicating the spec was not loaded.
- "Spec fetched successfully" text is not visible on the page after clicking Fetch.
- Spec preview element is not visible on the page.
- Project detail page was not reached because the spec content was not fetched and loaded.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/c808fa20-a258-4b00-8d07-3778cad607f7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC033 Invalid URL format shows validation error and allows correction
- **Test Code:** [TC033_Invalid_URL_format_shows_validation_error_and_allows_correction.py](./TC033_Invalid_URL_format_shows_validation_error_and_allows_correction.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/af655fdd-41e9-4b69-9141-c8f4dc7cfd5a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC034 Remote 404 fetch shows failure message and user can retry with another URL
- **Test Code:** [TC034_Remote_404_fetch_shows_failure_message_and_user_can_retry_with_another_URL.py](./TC034_Remote_404_fetch_shows_failure_message_and_user_can_retry_with_another_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/e17c2014-eff4-4f18-a770-e8a0a8cfd383
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC036 Create Project is blocked until a spec is successfully fetched and previewed
- **Test Code:** [TC036_Create_Project_is_blocked_until_a_spec_is_successfully_fetched_and_previewed.py](./TC036_Create_Project_is_blocked_until_a_spec_is_successfully_fetched_and_previewed.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Spec fetch failed with 'Failed to fetch: 404' when retrieving https://example.com/openapi.json.
- Spec fetch did not complete for https://petstore3.swagger.io/api/v3/openapi.json — 'Spec fetched successfully' is not present and the UI still shows 'Fetching...' and the 'No content provided' error.
- Create Project remains blocked: the red error 'No content provided. Please upload a file, paste content, or fetch from a URL.' is visible and project creation is not allowed.
- Verification that a project becomes creatable after a successful spec fetch could not be performed because no successful spec fetch occurred.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/1ec1d7f2-c7fa-41ad-941a-09c0f81f817c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC039 Project detail page renders core layout for an owned project
- **Test Code:** [TC039_Project_detail_page_renders_core_layout_for_an_owned_project.py](./TC039_Project_detail_page_renders_core_layout_for_an_owned_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/6bdbf89a-f9b3-4b6b-82ca-d2bc666be105
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC040 Project detail page shows two-column layout with endpoints table and server config panel
- **Test Code:** [TC040_Project_detail_page_shows_two_column_layout_with_endpoints_table_and_server_config_panel.py](./TC040_Project_detail_page_shows_two_column_layout_with_endpoints_table_and_server_config_panel.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/cf4aa553-c753-414b-8c0b-273ffc8579c5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC042 Navigate back to dashboard from project detail using back arrow
- **Test Code:** [TC042_Navigate_back_to_dashboard_from_project_detail_using_back_arrow.py](./TC042_Navigate_back_to_dashboard_from_project_detail_using_back_arrow.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/609d28f5-85d1-44fe-b8f9-b2fc06692a1a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC045 Project detail shows endpoint table columns and summary bar counts
- **Test Code:** [TC045_Project_detail_shows_endpoint_table_columns_and_summary_bar_counts.py](./TC045_Project_detail_shows_endpoint_table_columns_and_summary_bar_counts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/b461f2cb-25c0-4544-b166-719276bf1ed7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC046 Endpoint table shows method badge and path values for at least one row
- **Test Code:** [TC046_Endpoint_table_shows_method_badge_and_path_values_for_at_least_one_row.py](./TC046_Endpoint_table_shows_method_badge_and_path_values_for_at_least_one_row.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/d841d9cc-7461-4e2f-b18f-966535c2b4c3
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC049 Empty state appears when filters yield no endpoints
- **Test Code:** [TC049_Empty_state_appears_when_filters_yield_no_endpoints.py](./TC049_Empty_state_appears_when_filters_yield_no_endpoints.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/e75b34bc-d797-4a46-aa37-467d65da8c3a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC050 Search by path substring filters endpoint table and clearing restores results
- **Test Code:** [TC050_Search_by_path_substring_filters_endpoint_table_and_clearing_restores_results.py](./TC050_Search_by_path_substring_filters_endpoint_table_and_clearing_restores_results.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/1c007db0-f685-4195-bb1f-784cae37318e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC051 Search by operationId filters endpoint table and clearing restores results
- **Test Code:** [TC051_Search_by_operationId_filters_endpoint_table_and_clearing_restores_results.py](./TC051_Search_by_operationId_filters_endpoint_table_and_clearing_restores_results.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Clearing the endpoint search input did not restore the unfiltered endpoints table; visible Operation IDs after clearing were limited to getPetById, getInventory, getOrderById, getUserByName.
- Expected non-'get' operationIds (for example, addPet) to be visible after clearing the search, but they did not appear.
- The search input value appears empty after the clear action, yet the endpoints table remained filtered, indicating the clear action did not trigger a table refresh or remove the filter.
- No UI error or message explained why the filter persisted after clearing, and no evidence of a successful unfiltered table render was observed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ee3162f3-639e-4131-84dc-e6111f553cd8/adf82985-bfc5-4b3f-9e50-7117457f3138
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **83.33** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---