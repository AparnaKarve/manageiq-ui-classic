class GenericObjectDefinitionController < ApplicationController
  before_action :check_privileges
  before_action :get_session_data

  after_action :cleanup_action
  after_action :set_session_data

  include Mixins::GenericListMixin
  include Mixins::GenericSessionMixin
  include Mixins::GenericShowMixin

  menu_section :automate
  toolbar :generic_object_definition

  def self.display_methods
    %w(generic_objects)
  end

  def display_generic_objects
    nested_list("generic_object", GenericObject)
  end

  def self.model
    GenericObjectDefinition
  end

  def new
    assert_privileges('generic_object_definition_new')
    drop_breadcrumb(:name => _("Add a new Generic Object Class"), :url => "/generic_object_definition/new")
    @in_a_form = true
  end

  def button
    if params[:pressed] == 'generic_object_definition_new'
      javascript_redirect :action => 'new'
    end
  end

  private

  def textual_group_list
    [%i(properties relationships attribute_details_list association_details_list method_details_list)]
  end

  helper_method :textual_group_list
end
