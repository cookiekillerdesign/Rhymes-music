import { Link } from "react-router-dom";
import { Icon } from "./Icons";

/** Строка вакансии кликабельна целиком и ведёт на страницу вакансии. */
export default function JobList({ jobs }) {
  return (
    <ul className="jobs">
      {jobs.map((job) => (
        <li key={job.slug}>
          <Link to={`/jobs/${job.slug}`} className="job-row">
            <span className="job-row__main">
              <b>{job.title}</b>
              <span>{job.summary}</span>
            </span>
            <span className="job-row__tag">{job.dept}</span>
            <span className="job-row__tag">{job.place}</span>
            <span className="job-row__go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
