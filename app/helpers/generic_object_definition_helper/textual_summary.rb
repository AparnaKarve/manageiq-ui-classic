module GenericObjectDefinitionHelper::TextualSummary
  include TextualMixins::TextualName

  def textual_group_relationships
    TextualGroup.new(_("Relationships"), %i(generic_objects))
  end

  def textual_group_properties
      properties = %i()
      @record.properties.each do |key, value|
        properties.push("#{key}".to_sym)
        define_singleton_method("textual_#{key}") do
          {:label => _("%{label}") % {:label => key.capitalize}, :value => value.count}
        end
      end

    TextualGroup.new(_("Properties"), properties)
  end

  def textual_name
    {:label => _("Name"), :value => @record.name }
  end

  def textual_description
    {:label => _("Description"), :value => @record.description }
  end

  def textual_generic_objects
    num = @record.number_of(:generic_objects)
    h = {:label => _("Instances"), :value => num}
    if role_allows?(:feature => "generic_object_view") && num > 0
      h.update(:link  => url_for_only_path(:action => 'show', :id => @record, :display => 'generic_objects'),
               :title => _('Show all Instances'))
    end
    h
  end
end
