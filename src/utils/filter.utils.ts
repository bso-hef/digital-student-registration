import { ClassInterface } from "@/types/class";
import { Student } from "@/types/db";

export const filterStudents = (
  searchString = "",
  students: Student[] = [],
): Student[] => {
  if (!searchString || searchString.length < 3) return students;

  const filteredUsers = Array.isArray(students)
    ? students.filter((student: Student) => {
        const lowerSearchString = searchString.toLowerCase();

        const userNameMatch = student?.class
          ?.toLowerCase()
          .includes(lowerSearchString);

        const lastNameMatch = student?.lastName
          ?.toLowerCase()
          .includes(lowerSearchString);

        const firstNameMatch = student?.firstName
          ?.toLowerCase()
          .includes(lowerSearchString);

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
