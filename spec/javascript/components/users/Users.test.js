import Users from "../../../../app/javascript/components/users/Users";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom";


describe("Users", () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders page correctly', () => {
      const component = render(<Users current_user={user} users={[user]} />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })
})