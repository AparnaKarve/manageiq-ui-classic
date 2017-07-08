class GenericObjectController < ApplicationController
  before_action :check_privileges

  def create
    generic_object_definition = GenericObjectDefinition.new

    update_model_fields(generic_object_definition)
    generic_object_definition.save!

    render :json => {:message => _("Generic Object Definition created successfully")}
  end

  def save
    generic_object_definition = GenericObjectDefinition.find(params[:id])

    update_model_fields(generic_object_definition)

    render :json => {:message => _("Generic Object Definition saved successfully")}
  end

  def delete
    generic_object_definition = GenericObjectDefinition.find(params[:id])

    generic_object_definition.delete

    render :json => {:message => _("Generic Object Definition deleted")}
  end

  def explorer
    @layout = "generic_object"

    allowed_features = ApplicationController::Feature.allowed_features(features)
    @accords = allowed_features.map(&:accord_hash)
    @trees = {}
    @trees[:god_tree] = TreeBuilderGenericObjectDefinition.new.nodes
    @trees[:go_tree] = TreeBuilderGenericObject.new.nodes

    @explorer = true

    render :layout => "application"
  end

  def all_object_data
    if params[:root] == "god"
      all_generic_object_definitions = GenericObjectDefinition.all.select(%w(id name description))
      render :json => all_generic_object_definitions.to_json
    elsif params[:root] == "go"
      all_generic_objects = GenericObject.all.select(%w(id name))
      render :json => all_generic_objects.to_json
    end
  end

  def object_data
    nodetype, nodeid = params[:id].split("-")

    if nodetype == "god"
      x_node_set(params[:id], :god_tree)
      generic_object_definition = GenericObjectDefinition.find(nodeid)

      render :json => {
        :id          => generic_object_definition.id,
        :name        => generic_object_definition.name,
        :description => generic_object_definition.description
      }
    else
      x_node_set(params[:id], :go_tree)
      generic_object = GenericObject.find(nodeid)

      render :json => {
        :id          => generic_object.id,
        :name        => generic_object.name,
        # :description => generic_object.description
      }
    end
  end

  def tree_data
    tree_data = TreeBuilderGenericObjectDefinition.new.nodes

    render :json => {:tree_data => tree_data}
  end

  def accordion_select
    self.x_active_accord = params[:id].sub(/_accord$/, '')
    self.x_active_tree   = "#{self.x_active_accord}_tree"
    params[:id] = @sb[:trees][x_active_tree][:active_node]
    object_data
  end

  def replace_right_cell

  end

  private

  def update_model_fields(generic_object_definition)
    generic_object_definition.update_attributes(:name => params[:name], :description => params[:description])
  end

  def features
    # [ApplicationController::Feature.new_with_hash(:role        => "generic_object_explorer",
    #                                               :role_any    => true,
    #                                               :name        => :generic_object_explorer,
    #                                               :accord_name => "generic_object_definition_accordion",
    #                                               :title       => _("Generic Object Definitions"))]
    [{:role     => "generic_object_explorer",
      :role_any => true,
      :name     => :god,
      :accord_name => "god",
      :tree_name => :god_tree,
      :title    => _("Generic Object Definitions")},

     {:role     => "generic_object_explorer",
      :role_any => true,
      :name     => :go,
      :accord_name => "go",
      :tree_name => :go_tree,
      :title    => _("Generic Objects")},
    ].map do |hsh|
      ApplicationController::Feature.new_with_hash(hsh)
    end
  end

  menu_section :automate
  toolbar :generic_object_definition
end
