import Categories from "../../../../app/javascript/components/categories/Categories";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom";


describe("Cards", () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders page correctly', () => {
      const component = render(<Categories current_user={user} categories={[]} />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })
})