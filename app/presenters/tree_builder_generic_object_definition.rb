class TreeBuilderGenericObjectDefinition < TreeBuilder
  has_kids_for GenericObjectDefinition, [:x_get_god_kids]
  has_kids_for GenericObjectDefinition, [:x_get_actions_kids]

  private

  def root_options
    {
      :text    => t = _('All Generic Object Classes'),
      :tooltip => t
    }
  end

  def x_get_tree_roots(count_only, _options)
    count_only_or_objects(count_only, GenericObjectDefinition.all, :name)
  end

  def x_get_god_kids(object, count_only)
    count = object.custom_button_sets.count + object.custom_buttons.count
    objects = count > 0 ? [{:id => object.id.to_s, :text => _('Actions'), :icon => 'pficon pficon-folder-close', :tip => _('Actions')}] : []
    count_only_or_objects(count_only, objects)
  end

  def x_get_actions_kids(object, count_only)
    count_only_or_objects(count_only, object.custom_button_sets + object.custom_buttons, :name)
  end

  def tree_init_options(_tree_name)
    {:lazy => false}
  end
end
