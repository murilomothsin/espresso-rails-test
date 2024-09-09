import Statements from "../../../../app/javascript/components/statements/Statements";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom";


describe("Cards", () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders page correctly when admin', () => {
      const component = render(<Statements current_user={user} statements={JSON.stringify([])} categories={[]} />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })
  it('renders page correctly when regular user', () => {
    const component = render(<Statements current_user={{ ...user, role: "user"}} statements={JSON.stringify([])} categories={[]} />)
    expect(component.getByTestId('header')).toBeInTheDocument()
})
})