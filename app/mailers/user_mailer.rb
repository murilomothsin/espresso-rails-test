# frozen_string_literal: true
# rubocop:disable all
class UserMailer < ApplicationMailer
  def welcome_email
    @user = params[:user]
    @password = params[:password]
    mail(to: @user.email, subject: 'Bem-vindo ao Espresso! Aqui estão suas credenciais de acesso')
  end
end
