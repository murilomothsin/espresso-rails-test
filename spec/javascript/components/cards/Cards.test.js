import Cards from "../../../../app/javascript/components/cards/Cards";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom";


describe("Cards", () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders page correctly', () => {
      const component = render(<Cards current_user={user} cards={[]} users={[]} />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })
})