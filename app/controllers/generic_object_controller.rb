class GenericObjectController < ApplicationController
  before_action :check_privileges
  before_action :get_session_data

  after_action :cleanup_action
  after_action :set_session_data

  include Mixins::GenericListMixin
  include Mixins::GenericSessionMixin
  include Mixins::GenericShowMixin

  menu_section :automate

  def self.display_methods
    %w(property_attributes services)
  end

  def display_property_attributes
    nested_list("property_attribute", GenericObject)
  end

  def display_services
    nested_list("service", Service)
  end

  def self.model
    GenericObject
  end

  private

  def textual_group_list
    [%i(properties)]
    # []
  end

  helper_method :textual_group_list
end
