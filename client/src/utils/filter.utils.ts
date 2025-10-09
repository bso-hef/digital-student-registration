import { ClassInterface } from "@/types/class";
import { Student } from "@/types/db";

/********************************************************************************
 * Filters a list of users based on a given search string. Matches against
 * userName, lastName, firstName, or email.
 *
 * @function filterUsers
 * @param {string} searchString - The string to match against user properties.
 * @param {Array} students - The list of students objects to filter.
 * @returns {Array} A new array of students that match the search criteria.
 ********************************************************************************/
export const filterStudents = (searchString = "", students = []) => {
  if (!searchString || searchString.length < 3) return students;

  const filteredUsers = Array.isArray(students)
    ? students.filter((student: Student) => {
        const lowerSearchString = searchString.toLowerCase();

        // Check if userName matches the search string
        const userNameMatch = student?.class
          ?.toLowerCase()
          .includes(lowerSearchString);

        // Check if lastName matches the search string
        const lastNameMatch = student?.lastName
          ?.toLowerCase()
          .includes(lowerSearchString);

        // Check if firstName matches the search string
        const firstNameMatch = student?.firstName
          ?.toLowerCase()
          .includes(lowerSearchString);

        // Check if email matches the search string
        const emailMatch = student?.email
          ?.toLowerCase()
          .includes(lowerSearchString);

        return userNameMatch || lastNameMatch || firstNameMatch || emailMatch;
      })
    : [];

  return filteredUsers;
};

export const filterClasses = (
  searchString = "",
  classes: ClassInterface[] = [],
) => {
  if (!searchString || searchString.length < 3) return classes;

  const filteredClasses = Array.isArray(classes)
    ? classes.filter((classItem: ClassInterface) => {
        const lowerSearchString = searchString.toLowerCase();

        const nameMatch = classItem?.name
          ?.toLowerCase()
          .includes(lowerSearchString);

        return nameMatch;
      })
    : [];

  return filteredClasses;
};
