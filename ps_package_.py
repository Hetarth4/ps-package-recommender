# -*- coding: utf-8 -*-
"""PS package Streamlit App

Professional Services Package Recommender for ThoughtSpot
"""

import streamlit as st

# Page configuration
st.set_page_config(
    page_title="ThoughtSpot PS Package Recommender",
    page_icon="📦",
    layout="wide"
)

# Define dropdown options with associated scores
team_size_options = {
    "Select...": 0,
    "<10 users": 1,
    "10–50 users": 2,
    "50–100 users": 3,
    "Hundreds of users (enterprise-wide)": 4
}
primary_need_options = {
    "Select...": 0,
    "Proof of Concept": 1,
    "Production-ready polished use case": 2
}
data_complexity_options = {
    "Select...": 0,
    "Single data source (simple schema)": 1,
    "Multiple data sources (moderate complexity)": 2,
    "Complex multi-source integration (advanced)": 3
}
business_logic_options = {
    "Select...": 0,
    "Standard aggregations": 1,
    "Advanced formulas, custom calendars": 3
}
security_req_options = {
    "Select...": 0,
    "Basic group RLS": 1,
    "Advanced user-level, compliance-heavy": 3
}
training_needs_options = {
    "Select...": 0,
    "2 seats": 1,
    "5 seats": 2,
    "15 seats": 3,
    "More than 15 seats": 3
}
use_cases_options = {
    "Select...": 0,
    "1": 1,
    ">1 (Multiple)": 3
}
go_live_options = {
    "Select...": 0,
    "Guided/advisory": 1,
    "Hands on support/co-build": 3
}
tse_type_options = {
    "Select...": 0,
    "Out of Box TSE": 1,
    "Custom Actions": 2
}

# Function to generate reasoning
def generate_reasoning(total_score, is_mig, tse_selected, tse_type_val, recommended_package):
    reasons = []
    if total_score <= 12:
        level = "low complexity/scale"
        features = "light onboarding, core platform setup, basic training (2 users), 1 basic Liveboard, and best practices enablement."
        presentation_url = "https://docs.google.com/presentation/d/1pM38OTjtXXOGec_amVXO_dqnvfk2R24uGgjfPyE8UPI/edit?slide=id.g31b73a28df8_1_1472#slide=id.g31b73a28df8_1_1472"
    elif total_score <= 20:
        level = "medium complexity/scale"
        features = "polished use case deployment, guided implementation, training for 5 users, rollout planning, and embedding best practices."
        presentation_url = "https://docs.google.com/presentation/d/1pM38OTjtXXOGec_amVXO_dqnvfk2R24uGgjfPyE8UPI/edit?slide=id.g31b73a28df8_1_1472#slide=id.g31b73a28df8_1_1472"
    else:
        level = "high complexity/scale"
        features = "advanced deployment, co-development, training for 15+ users, complex integrations, iterative rollout, and strategic partnership."
        presentation_url = "https://docs.google.com/presentation/d/1pM38OTjtXXOGec_amVXO_dqnvfk2R24uGgjfPyE8UPI/edit?slide=id.g31b73a28df8_1_1472#slide=id.g31b73a28df8_1_1472"

    reasons.append(f"This recommendation is based on your selections indicating {level}, which aligns with the {recommended_package} package.")
    reasons.append(f"Key matching features: {features}")

    if tse_selected == "TSE (ThoughtSpot Embedding)":
        reasons.append(f"Deployment type is TSE, with {tse_type_val} configuration, enhancing embedding capabilities.")
    else:
        reasons.append("Deployment type is TSA, focusing on cloud-based platform functionality.")

    if is_mig:
        reasons.append("As a migration project, this includes use case modernization workshops, dashboard migration support, and change management.")
    else:
        reasons.append("This focuses on new onboarding with platform configuration and Spotter development support.")

    return reasons, presentation_url

# Main UI
st.title("📦 ThoughtSpot Professional Services Package Recommender")
st.markdown("Answer the questions below to recommend the best onboarding or migration package.")

# Initialize session state
if 'recommended_package' not in st.session_state:
    st.session_state.recommended_package = None
if 'package_type' not in st.session_state:
    st.session_state.package_type = ""

# Form inputs
col1, col2 = st.columns(2)

with col1:
    team_size = st.selectbox("Number of Users for Go-Live:", options=list(team_size_options.keys()))
    primary_need = st.selectbox("Primary Need:", options=list(primary_need_options.keys()))
    data_complexity = st.selectbox("Data Composition:", options=list(data_complexity_options.keys()))
    business_logic = st.selectbox("Business Logic Needs:", options=list(business_logic_options.keys()))
    security_req = st.selectbox("Security Requirements:", options=list(security_req_options.keys()))

with col2:
    training_needs = st.selectbox("Training Needs (Seats):", options=list(training_needs_options.keys()))
    use_cases = st.selectbox("Number of Use Cases:", options=list(use_cases_options.keys()))
    go_live = st.selectbox("Level of Implementation Support Required:", options=list(go_live_options.keys()))
    tsa_tse = st.selectbox("Deployment Type (TSA/TSE):", options=["Select...", "TSA (ThoughtSpot Cloud)", "TSE (ThoughtSpot Embedding)"])
    
    # Conditional TSE type field
    tse_type_disabled = tsa_tse != "TSE (ThoughtSpot Embedding)"
    tse_type = st.selectbox(
        "TSE Type (if TSE selected):",
        options=list(tse_type_options.keys()),
        disabled=tse_type_disabled
    )
    
    is_migration = st.checkbox("Is this a Migration Project (for existing customers)?")

# Submit button
if st.button("Submit & Recommend", type="primary"):
    selections = [
        team_size, primary_need, data_complexity,
        business_logic, security_req,
        training_needs, use_cases, go_live
    ]

    if "Select..." in selections or tsa_tse == "Select...":
        st.error("Please fill out all fields, including Deployment Type.")
    else:
        # Calculate total score
        total_score = sum([
            team_size_options[team_size],
            primary_need_options[primary_need],
            data_complexity_options[data_complexity],
            business_logic_options[business_logic],
            security_req_options[security_req],
            training_needs_options[training_needs],
            use_cases_options[use_cases],
            go_live_options[go_live]
        ])
        
        if tsa_tse == "TSE (ThoughtSpot Embedding)" and tse_type == "Custom Actions":
            total_score += 1

        # Determine package level
        if total_score <= 12:
            package_level = "Starter"
        elif total_score <= 20:
            package_level = "Advanced"
        else:
            package_level = "Premium"

        # Set package type and name
        if is_migration:
            package_type = "Modernization"
            recommended_package = f"{package_type} {package_level}"
            price = {"Starter": 20000, "Advanced": 50000, "Premium": 80000}[package_level]
        else:
            package_type = "Jumpstart AI"
            recommended_package = f"{package_type} {package_level}"
            price = {"Starter": 5000, "Advanced": 20000, "Premium": 60000}[package_level]

        # Store in session state
        st.session_state.recommended_package = recommended_package
        st.session_state.package_type = package_type
        st.session_state.total_score = total_score
        st.session_state.price = price
        st.session_state.is_migration = is_migration
        st.session_state.tsa_tse = tsa_tse
        st.session_state.tse_type = tse_type
        
        st.success("Recommendation generated! Scroll down to see results.")

# Display results if available
if st.session_state.recommended_package:
    st.markdown("---")
    
    # Recommended Package
    st.markdown("### ✅ Recommended Package")
    result_container = st.container()
    with result_container:
        st.info(f"**{st.session_state.recommended_package}** (Score: {st.session_state.total_score}, Approx. Price: ${st.session_state.price:,})")
    
    # Reasoning
    st.markdown("### 💡 Reasoning")
    reasons, presentation_url = generate_reasoning(
        st.session_state.total_score,
        st.session_state.is_migration,
        st.session_state.tsa_tse,
        st.session_state.tse_type,
        st.session_state.recommended_package
    )
    
    for reason in reasons:
        st.markdown(f"- {reason}")
    
    # Presentation button
    st.markdown(f"[View {st.session_state.recommended_package} Presentation]({presentation_url})")
    
    # ACV Validation
    st.markdown("---")
    st.markdown("### 💰 ACV Validation")
    st.markdown("Enter the account's Annual Contract Value (ACV) to validate the recommendation.")
    
    acv = st.number_input("Annual Contract Value (ACV) in USD:", min_value=0.0, value=0.0, step=1000.0)
    
    if st.button("Validate with ACV", type="secondary"):
        if acv <= 0:
            st.error("Please enter a valid ACV greater than 0.")
        else:
            # ACV-based allowed packages
            if acv < 100000:
                allowed_levels = ["Starter", "Advanced"]
                allowed_str = "Starter or Advanced package"
            elif 100000 <= acv < 150000:
                allowed_levels = ["Advanced"]
                allowed_str = "Advanced package"
            else:
                allowed_levels = ["Premium"]
                allowed_str = "Premium package"

            # Extract level from recommendation
            rec_level = st.session_state.recommended_package.split()[-1]

            if rec_level in allowed_levels:
                st.success(f"The recommendation ({st.session_state.recommended_package}) aligns with ACV ${acv:,.2f}. Proceed confidently.")
            else:
                st.warning(f"Rethink for ACV ${acv:,.2f}: Suggest {allowed_str} ({st.session_state.package_type} {allowed_str.lower()}) instead of {rec_level}. Alternatively, reach out to the PS team for further guidance.")
                
                # Contact table
                st.markdown("### 📞 Contact PS Team")
                contact_data = {
                    "Region": ["NA", "NA", "EMEA", "EMEA", "Scale"],
                    "Name": ["MJ Densmore", "Carolyn Chupa", "Camilla Tanzi", "Hetarth Chokshi", "Arjun Krishnan"]
                }
                st.table(contact_data)
