import FormCardModal from "../../../../app/javascript/components/cards/FormCardModal";
import {render, fireEvent, waitFor, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";


describe("FormCardModal", () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  const card = {
    id: 1,
    user_id: 1,
    last4: "1234",
  }
  it('renders component correctly', () => {
      const component = render(<FormCardModal card={card} users={[user]} open handleClose={() => true } handleOpen={() => true } />)
      expect(component.getByTestId('form-card-edit')).toBeInTheDocument()
  })

  it('fullfil last4 input', () => {
    const component = render(<FormCardModal open card={{}} users={[user]} handleClose={() => true} handleOpen={() => true} />)
    const input = component.getByLabelText('Número')
    fireEvent.change(input, {target: {value: 'teste'}})
    expect(input.value).toBe('teste')
  })

  it("should display options", async () => {
    render(<FormCardModal card={card} users={[user]} open handleClose={() => true } handleOpen={() => true } />);

    const dropdown = within(await screen.findByTestId("user-select")).getByRole("combobox");
    await userEvent.click(dropdown);
    expect(
      await screen.findByRole("option", { name: "John Doe" }),
    ).toBeInTheDocument();
  });

  it("should display selected user", async () => {
    render(<FormCardModal card={card} users={[user]} open handleClose={() => true } handleOpen={() => true } />);

    const dropdown = within(await screen.findByTestId("user-select")).getByRole("combobox");
    await userEvent.click(dropdown);
    await userEvent.click(await screen.findByRole("option", { name: "John Doe" }));
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it('should call submit and send data', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const mockHandleClose = jest.fn();
    render(<FormCardModal card={card} users={[user]} open handleClose={mockHandleClose} handleOpen={() => true } />);
    const button = screen.getByText('Cadastrar')
    fireEvent.click(button)
    await flushPromises()
    expect(mockHandleClose.mock.calls).toHaveLength(1);
  })
})