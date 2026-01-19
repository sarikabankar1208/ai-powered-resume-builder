import { createClient } from "@supabase/supabase-js"; 
const supabaseUrl = "https://crixtukxwqdvkhlzpxwf.supabase.co"; 
const supabaseAnonKey = "sb_publishable_7qmdC_DGWfRyx3A2Gcq95A_OEMf4SUY"; 
export const supabase = createClient( supabaseUrl, supabaseAnonKey );

const savePersonalInfo = async () => {
  const { data, error } = await supabase
    .from("resumes")
    .upsert({
      personal_info: formData.personalInfo,
      updated_at: new Date()
    })

  if (error) {
    alert("Error saving data")
    console.error(error)
  } else {
    alert("Personal info saved successfully")
  }
}

const saveEducation = async () => {
  await supabase
    .from("resumes")
    .upsert({
      education: formData.education,
      updated_at: new Date()
    })
}

const saveSkills = async () => {
  await supabase
    .from("resumes")
    .upsert({
      skills: formData.skills,
      updated_at: new Date()
    })
}

const saveExperience = async () => {
  await supabase
    .from("resumes")
    .upsert({
      experience: formData.experience,
      updated_at: new Date()
    })
}

