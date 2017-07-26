module GenericObjectHelper::TextualSummary
  include TextualMixins::TextualName

  def textual_group_properties
    properties = %i(attributes)
    @record.property_associations.each do |key, _value|
      p "%%%%%%%%%%%%%%%%%%%%%"
      p key
      p "%%%%%%%%%%%%%%%%%%%%%"
      properties.push("#{key}".to_sym)
      define_singleton_method("textual_#{key}") do
        num = @record.send(key).count
        h = {:label => _("%{label}") % {:label => key.capitalize}, :value => num}
        if role_allows?(:feature => "generic_object_view") && num > 0
          h.update(:link  => url_for_only_path(:action => 'show', :id => @record, :display => key),
                   :title => _('Show all %{services}') % {:services => key.capitalize})
        end
      end
    end
    TextualGroup.new(_("Properties"), properties)
  end

  # def textual_group_properties1
  #   properties = %i()
  #   @record.properties.each do |key, value|
  #     properties.push("#{key}".to_sym)
  #     define_singleton_method("textual_#{key}") do
  #       {:label => _("%{label}") % {:label => key.capitalize}, :value => value.count}
  #     end
  #   end
  #
  #   TextualGroup.new(_("Properties"), properties)
  # end

  def textual_attributes
    num = @record.property_attributes.count
    h = {:label => _("Attributes"), :value => num}
    if role_allows?(:feature => "generic_object_view") && num > 0
      h.update(:link  => url_for_only_path(:action => 'show', :id => @record, :display => 'property_attributes'),
               :title => _('Show all Attributes'))
    end
  end

  # def textual_services
  #   num = @record.services.count
  #   h = {:label => _("Services"), :value => num}
  #   if role_allows?(:feature => "generic_object_view") && num > 0
  #     h.update(:link  => url_for_only_path(:action => 'show', :id => @record, :display => 'services'),
  #              :title => _('Show all Services'))
  #   end
  # end
end
