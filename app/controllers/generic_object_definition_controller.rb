class GenericObjectDefinitionController < ApplicationController
  before_action :check_privileges
  before_action :get_session_data

  before_action :custom_button_or_group, :only => [:show]
  before_action :build_tree, :only => [:show_list]

  after_action :cleanup_action
  after_action :set_session_data

  include Mixins::GenericListMixin
  include Mixins::GenericSessionMixin
  include Mixins::GenericShowMixin

  menu_section :automate

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
      when 'generic_object_definition_custom_button_group_edit'
        { :action => 'custom_button_group_edit', :id => from_cid(params[:id] || params[:miq_grid_checks]) }
      end
    )
  end

  def new
    assert_privileges('generic_object_definition_new')
    drop_breadcrumb(:name => _("Add a new Generic Object Class"), :url => "/generic_object_definition/new")
    @in_a_form = true
  end

  def edit
    assert_privileges('generic_object_definition_edit')
    drop_breadcrumb(:name => _("Edit Generic Object Class"), :url => "/generic_object_definition/edit/#{params[:id]}")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @in_a_form = true
  end

  def self.display_methods
    %w(generic_objects)
  end

  def default_show_template
    "generic_object_definition/show"
  end

  def display_tree
    true
  end

  def custom_button_or_group
    @cb_group = params[:cbs]
    @cb = params[:cb]
    @cb_group_actions = params[:actions]
  end

  def custom_button_group_new
    assert_privileges('generic_object_definition_custom_button_group_new')
    drop_breadcrumb(:name => _("Add a new Custom Button Group"), :url => "/generic_object_definition/custom_button_group_new")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @in_a_form = true
  end

  def custom_button_group_edit
    assert_privileges('generic_object_definition_custom_button_group_edit')
    drop_breadcrumb(:name => _("Add a new Custom Button Group"), :url => "/generic_object_definition/custom_button_group_new")
    @generic_object_definition = GenericObjectDefinition.find(params[:id])
    @in_a_form = true
  end

  def tree_autoload
    @view ||= session[:view]
    super
  end

  def tree_select
    @lastaction = "explorer"
    @flash_array = nil
    self.x_active_tree = params[:tree] if params[:tree]
    self.x_node = params[:id]
    # load_or_clear_adv_search
    # apply_node_search_text if x_active_tree == "#{manager_prefix}_providers_tree".to_sym

    if action_name == "reload"
      replace_right_cell(:replace_trees => [x_active_accord])
    else
      # @sb[:active_tab] = if active_tab_configured_systems?
      #                      'configured_systems'
      #                    else
      #                      'summary'
      #                    end
      # replace_right_cell
      render :new #something
    end
  end

  def build_tree

  end

  def tree_autoload
    @view ||= session[:view]
    super
  end



  private

  def textual_group_list
    [%i(properties relationships attribute_details_list association_details_list method_details_list)]
  end

  helper_method :textual_group_list
end
