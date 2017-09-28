class GenericObjectDefinitionController < ApplicationController
  before_action :check_privileges
  before_action :get_session_data

  after_action :cleanup_action
  after_action :set_session_data

  include Mixins::GenericListMixin
  include Mixins::GenericSessionMixin
  include Mixins::GenericShowMixin

  include Mixins::ExplorerPresenterMixin

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

  def button
    if @display == 'generic_objects' && params[:pressed] == 'generic_object_tag'
      tag(GenericObject)
      return
    end
    javascript_redirect(
      case params[:pressed]
      when 'generic_object_definition_new'
        { :action => 'new' }
      when 'generic_object_definition_edit'
        { :action => 'edit', :id => from_cid(params[:id] || params[:miq_grid_checks]) }
      when 'generic_object_definition_custom_button_group_new'
        { :action => 'custom_button_group_new', :id => from_cid(params[:id] || params[:miq_grid_checks]) }
      when 'generic_object_definition_custom_button_new'
        { :action => 'custom_button_new', :id => from_cid(params[:id] || params[:miq_grid_checks]) }
      end
    )
  end

  def new
    assert_privileges('generic_object_definition_new')
    drop_breadcrumb(:name => _("Add a new Generic Object Class"), :url => "/generic_object_definition/new")
    @in_a_form = true
    # @explorer = true
    presenter = rendering_objects
    presenter.update(:main_div, r[:partial => "new"])
    render :json => presenter.for_render
  end

  def edit
    assert_privileges('generic_object_definition_edit')
    drop_breadcrumb(:name => _("Edit Generic Object Class"), :url => "/generic_object_definition/edit/#{params[:id]}")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @in_a_form = true
  end

  def custom_button_group_new
    assert_privileges('generic_object_definition_custom_button_group_new')
    drop_breadcrumb(:name => _("Add a new Custom Button Group"), :url => "/generic_object_definition/custom_button_group_new")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @right_cell_text = _("Add a new Custom Button Group for '%s'") % @generic_object_definition.name
    @explorer = true

    # @in_a_form = true
  end

  def custom_button_new
    assert_privileges('generic_object_definition_custom_button_new')
    drop_breadcrumb(:name => _("Add a new Custom Button"), :url => "/generic_object_definition/custom_button_new")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @right_cell_text = _("Add a new Custom Button for '%s'") % @generic_object_definition.name
    @explorer = true

    # @in_a_form = true
  end

  def show_list_explorer
    true
  end

  def tree_select
    p "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    p "Tree Selected"
    p params
    p "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
    @explorer = true
    presenter = rendering_objects
    # update_partials(true, presenter)
    # @record = GenericObjectDefinition.where(:id => params[:id].split("_")[1]).first
    # presenter.update(:main_div, r[:partial => "layouts/textual_groups_generic"])
    # render :json => presenter.for_render
    # render :json => presenter.for_render
    # javascript_redirect :action => "show", :id => params[:id].split("_")[1]

    render :layout => false

    # id = params[:id].split("_")[1]

    # format.js {render :js => "window.location.href='#{show/params[:id].split("_")[1]}'"}
    # render :js => javascript_redirect :action => "show", :id => params[:id].split("_")[1]

  end

  def show
    @record = GenericObjectDefinition.where(:id => 10000000000001).first
    p "^^^^^^^^^^^^^^^^^^^ Hi"
    presenter = rendering_objects
    presenter.update(:main_div, r[:partial => "layouts/textual_groups_generic"])
    # render :json => presenter.for_render
  end

  def self.display_methods
    %w(generic_objects)
  end

  def default_show_template
    "generic_object_definition/show"
  end

  private

  def textual_group_list
    [%i(properties relationships attribute_details_list association_details_list method_details_list)]
  end

  helper_method :textual_group_list
end
