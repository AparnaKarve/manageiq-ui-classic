class TreeBuilderGenericObject
  def nodes
    all_generic_objects = GenericObject.all

    children = all_generic_objects.collect do |generic_object|
      {
        :text => generic_object.name,
        :tooltip => generic_object.name,
        :href => "##{generic_object.name}",
        :icon => "fa fa-file-o",
        :tags => ["2"],
        :id   => "go-#{generic_object.id}"
      }
    end

    [{
       :text  => 'Generic Objects',
       :tooltip => 'Generic Objects',
       :href  => '#generic-objects-root',
       :tags  => ['4'],
       :nodes => children
     }].to_json
  end
end
