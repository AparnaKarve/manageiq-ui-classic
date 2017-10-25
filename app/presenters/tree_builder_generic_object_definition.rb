class TreeBuilderGenericObjectDefinition < TreeBuilder
  # has_kids_for Hash, [:x_get_god_kids]
  has_kids_for GenericObjectDefinition, [:x_get_actions_kids]

  private

  def root_options
    {
      :text    => t = _('All Generic Object Classes'),
      :tooltip => t
    }
  end

  def x_get_tree_roots(count_only, _options)
    count_only_or_objects(count_only, GenericObjectDefinition.all.to_a, :name)
  end
  # def x_get_tree_roots(count_only, _options)
  #   objects = []
  #   objects.push(:id            => "fr",
  #                :tree          => "fr_tree",
  #                :text          => _("%{name} Providers") % {:name => ui_lookup(:ui_title => 'foreman')},
  #                :icon          => "pficon pficon-folder-close",
  #                :tip           => _("%{name} Providers") % {:name => ui_lookup(:ui_title => 'foreman')},
  #                :load_children => true)
  #   count_only_or_objects(count_only, objects)
  # end

  def x_get_tree_custom_kids(object, count_only, _options)
    # build node showing any button groups or buttons under selected CatalogItem
    p "x_get_tree_custom_kids   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    p object
    p "x_get_tree_custom_kids   &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    count_only_or_objects_filtered(count_only, GenericObjectDefinition, "name")
  end

  def x_get_god_kids(object, count_only)
    # count = object.custom_button_sets.count + object.custom_buttons.count
    # objects = count > 0 ? [{:id => object.id.to_s, :text => _('Actions'), :icon => 'pficon pficon-folder-close', :tip => _('Actions')}] : []
    # count_only_or_objects(count_only, objects)
  end
  # def x_get_god_kids(object, count_only)
  #   nodes << {
  #     :title =>   t = _('Actions'),
  #     :tooltip => t,
  #     :object  => object
  #   } if object.custom_button_sets.any?
  #   count_only_or_objects(count_only, nodes, :name)
  # end


  def x_get_actions_kids(object, count_only)
    count_only_or_objects(count_only, object.custom_button_sets + object.custom_buttons, :name)
  end

  def tree_init_options(_tree_name)
    {:lazy => false}
  end
end
