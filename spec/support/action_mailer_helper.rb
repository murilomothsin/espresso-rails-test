# frozen_string_literal: true

RSpec::Matchers.define :deliver_later do |expected_method|
  match do |mailer_class|
    mailer = double(:mailer)
    mail = double(:mail)

    expect(mailer_class).to receive(:with).and_return(mailer)
    expect(mailer).to receive(expected_method).and_return(mail)
    expect(mail).to receive(:deliver_later)
  end
end
