import { forwardRef } from "react";
import ClassicTemplate from "./templates/ClassicTemplate";

const ResumePreview = forwardRef(({ formData, accent }, ref) => {
  return (
    <div ref={ref}>
      <ClassicTemplate formData={formData} accent={accent} />
    </div>
  );
});

export default ResumePreview;


